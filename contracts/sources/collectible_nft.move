module onematch::collectible_nft {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use sui::event;
    use sui::bcs;
    use sui::ed25519;

    /// Collectible NFT - Tradeable
    public struct CollectibleNFT has key, store {
        id: UID,
        card_name: String,
        rarity: u8,
        edition_number: u64,
        total_supply: u64,
        metadata_uri: String,
        mint_timestamp: u64,
    }

    /// Collection registry
    public struct CollectionRegistry has key {
        id: UID,
        backend_public_key: vector<u8>,
        total_minted: u64,
        cards_by_rarity: Table<u8, u64>,
    }

    /// Rarity constants
    const RARITY_COMMON: u8 = 1;
    const RARITY_RARE: u8 = 2;
    const RARITY_LEGENDARY: u8 = 3;

    /// Events
    public struct CollectibleMinted has copy, drop {
        player: address,
        card_name: String,
        rarity: u8,
        edition_number: u64,
    }

    public struct CollectibleTransferred has copy, drop {
        from: address,
        to: address,
        card_name: String,
    }

    /// Error codes
    const EInvalidRarity: u64 = 1;
    const EInvalidProof: u64 = 2;

    /// Initialize the module
    /// IMPORTANT: Replace the public key below with your actual backend ed25519 public key
    fun init(ctx: &mut TxContext) {
        // TODO: Replace with your actual backend public key (32 bytes)
        let backend_key = vector[
            0xd5, 0x11, 0x39, 0x5f, 0x29, 0xa1, 0x56, 0xc4,
            0x31, 0x28, 0x10, 0x82, 0xf4, 0x1e, 0x3b, 0x89,
            0xbb, 0x4f, 0x22, 0x89, 0x25, 0xc4, 0x3c, 0xe3,
            0x84, 0xd7, 0x0a, 0x2e, 0xf2, 0xce, 0xc4, 0x61
        ];

        let mut registry = CollectionRegistry {
            id: object::new(ctx),
            backend_public_key: backend_key,
            total_minted: 0,
            cards_by_rarity: table::new(ctx),
        };

        // Initialize rarity counters
        table::add(&mut registry.cards_by_rarity, RARITY_COMMON, 0);
        table::add(&mut registry.cards_by_rarity, RARITY_RARE, 0);
        table::add(&mut registry.cards_by_rarity, RARITY_LEGENDARY, 0);

        transfer::share_object(registry);
    }

    /// Player claims collectible with backend proof
    public entry fun claim_collectible(
        registry: &mut CollectionRegistry,
        card_name: String,
        rarity: u8,
        total_supply: u64,
        metadata_uri: String,
        proof: vector<u8>,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        
        // Validate rarity
        assert!(
            rarity == RARITY_COMMON || rarity == RARITY_RARE || rarity == RARITY_LEGENDARY,
            EInvalidRarity
        );

        // Verify backend proof
        verify_proof(&player, &card_name, rarity, &proof, &registry.backend_public_key);

        // Update registry
        registry.total_minted = registry.total_minted + 1;
        let rarity_count = table::borrow_mut(&mut registry.cards_by_rarity, rarity);
        *rarity_count = *rarity_count + 1;
        let edition_number = *rarity_count;

        // Create NFT
        let nft = CollectibleNFT {
            id: object::new(ctx),
            card_name,
            rarity,
            edition_number,
            total_supply,
            metadata_uri,
            mint_timestamp: tx_context::epoch_timestamp_ms(ctx),
        };

        // Emit event
        event::emit(CollectibleMinted {
            player,
            card_name,
            rarity,
            edition_number,
        });

        // Transfer to player (can be traded)
        transfer::public_transfer(nft, player);
    }

    /// Transfer collectible to another player
    public entry fun transfer_collectible(
        nft: CollectibleNFT,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        event::emit(CollectibleTransferred {
            from: sender,
            to: recipient,
            card_name: nft.card_name,
        });

        transfer::public_transfer(nft, recipient);
    }

    /// Get collection statistics
    public fun get_collection_stats(registry: &CollectionRegistry): (u64, u64, u64, u64) {
        let common = *table::borrow(&registry.cards_by_rarity, RARITY_COMMON);
        let rare = *table::borrow(&registry.cards_by_rarity, RARITY_RARE);
        let legendary = *table::borrow(&registry.cards_by_rarity, RARITY_LEGENDARY);
        
        (registry.total_minted, common, rare, legendary)
    }

    /// Verify backend proof (signature)
    fun verify_proof(
        player: &address,
        card_name: &String,
        rarity: u8,
        proof: &vector<u8>,
        public_key: &vector<u8>
    ) {
        let mut message = bcs::to_bytes(player);
        vector::append(&mut message, *string::bytes(card_name));
        vector::push_back(&mut message, rarity);

        assert!(
            ed25519::ed25519_verify(proof, public_key, &message),
            EInvalidProof
        );
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
