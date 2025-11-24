module onematch::achievement_nft {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use sui::event;
    use sui::bcs;
    use sui::ed25519;

    /// Achievement NFT - Soulbound (non-transferable)
    public struct AchievementNFT has key {
        id: UID,
        achievement_type: String,
        earned_timestamp: u64,
        metadata_uri: String,
        player_stats: String,
    }

    /// Registry to track earned achievements
    public struct AchievementRegistry has key {
        id: UID,
        backend_public_key: vector<u8>,
        earned: Table<address, vector<String>>,
    }

    /// Admin capability
    public struct AdminCap has key {
        id: UID,
    }

    /// Events
    public struct AchievementClaimed has copy, drop {
        player: address,
        achievement_type: String,
        timestamp: u64,
    }

    /// Error codes
    const EAlreadyClaimed: u64 = 1;
    const EInvalidProof: u64 = 2;
    const ENotAuthorized: u64 = 3;

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

        let registry = AchievementRegistry {
            id: object::new(ctx),
            backend_public_key: backend_key,
            earned: table::new(ctx),
        };
        transfer::share_object(registry);

        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin_cap, tx_context::sender(ctx));
    }

    /// Player claims achievement with backend proof
    public entry fun claim_achievement(
        registry: &mut AchievementRegistry,
        achievement_type: String,
        metadata_uri: String,
        player_stats: String,
        proof: vector<u8>,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        
        // Check if already claimed
        assert!(!has_achievement(registry, player, &achievement_type), EAlreadyClaimed);

        // Verify backend proof
        verify_proof(&player, &achievement_type, &proof, &registry.backend_public_key);

        // Create NFT
        let nft = AchievementNFT {
            id: object::new(ctx),
            achievement_type,
            earned_timestamp: tx_context::epoch_timestamp_ms(ctx),
            metadata_uri,
            player_stats,
        };

        // Record achievement
        if (!table::contains(&registry.earned, player)) {
            table::add(&mut registry.earned, player, vector::empty());
        };
        let earned_list = table::borrow_mut(&mut registry.earned, player);
        vector::push_back(earned_list, achievement_type);

        // Emit event
        event::emit(AchievementClaimed {
            player,
            achievement_type,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        });

        // Transfer to player (soulbound - cannot be transferred after this)
        transfer::transfer(nft, player);
    }

    /// Check if player has specific achievement
    public fun has_achievement(
        registry: &AchievementRegistry,
        player: address,
        achievement_type: &String
    ): bool {
        if (!table::contains(&registry.earned, player)) {
            return false
        };
        
        let earned_list = table::borrow(&registry.earned, player);
        vector::contains(earned_list, achievement_type)
    }

    /// Get all achievements for player
    public fun get_player_achievements(
        registry: &AchievementRegistry,
        player: address
    ): vector<String> {
        if (!table::contains(&registry.earned, player)) {
            return vector::empty()
        };
        
        *table::borrow(&registry.earned, player)
    }

    /// Verify backend proof (signature)
    fun verify_proof(
        player: &address,
        achievement_type: &String,
        proof: &vector<u8>,
        public_key: &vector<u8>
    ) {
        // Create message from player address and achievement type
        let mut message = bcs::to_bytes(player);
        vector::append(&mut message, *string::bytes(achievement_type));

        // Verify Ed25519 signature
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
