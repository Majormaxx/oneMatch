module onematch::admin {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::String;

    /// Admin capability
    public struct AdminCap has key {
        id: UID,
    }

    /// Minting configuration
    public struct MintingConfig has key {
        id: UID,
        paused: bool,
        base_metadata_uri: String,
        backend_public_key: vector<u8>,
        admin: address,
    }

    /// Error codes
    const ENotAuthorized: u64 = 1;
    const EMintingPaused: u64 = 2;

    /// Initialize admin module
    fun init(ctx: &mut TxContext) {
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };
        
        let admin = tx_context::sender(ctx);
        transfer::transfer(admin_cap, admin);

        let config = MintingConfig {
            id: object::new(ctx),
            paused: false,
            base_metadata_uri: std::string::utf8(b"ipfs://"),
            backend_public_key: vector::empty(),
            admin,
        };
        transfer::share_object(config);
    }

    /// Pause all minting
    public entry fun pause_minting(
        _admin_cap: &AdminCap,
        config: &mut MintingConfig
    ) {
        config.paused = true;
    }

    /// Resume minting
    public entry fun unpause_minting(
        _admin_cap: &AdminCap,
        config: &mut MintingConfig
    ) {
        config.paused = false;
    }

    /// Update metadata URI
    public entry fun update_metadata_uri(
        _admin_cap: &AdminCap,
        config: &mut MintingConfig,
        new_uri: String
    ) {
        config.base_metadata_uri = new_uri;
    }

    /// Update backend public key
    public entry fun update_backend_key(
        _admin_cap: &AdminCap,
        config: &mut MintingConfig,
        new_key: vector<u8>
    ) {
        config.backend_public_key = new_key;
    }

    /// Check if minting is paused
    public fun is_paused(config: &MintingConfig): bool {
        config.paused
    }

    /// Get backend public key
    public fun get_backend_key(config: &MintingConfig): vector<u8> {
        config.backend_public_key
    }

    /// Assert minting is not paused
    public fun assert_not_paused(config: &MintingConfig) {
        assert!(!config.paused, EMintingPaused);
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
