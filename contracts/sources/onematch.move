module onematch::core {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::table::{Self, Table};
    use std::string:: String;
    use sui::event;
    use sui::bcs;
    use sui::ed25519;

    /// Player profile
    public struct PlayerProfile has key {
        id: UID,
        owner: address,
        games_played: u64,
        games_won: u64,
        perfect_games: u64,
        current_streak: u64,
        longest_streak: u64,
        total_xp: u64,
        level: u64,
        last_daily_claim: u64,
    }

    /// Game registry (shared state)
    public struct GameRegistry has key {
        id: UID,
        admin: address,
        backend_public_key: vector<u8>,
        claim_records: Table<address, vector<String>>,
    }

    /// Events
    public struct ProfileCreated has copy, drop {
        player: address,
    }

    public struct GameResultSubmitted has copy, drop {
        player: address,
        score: u64,
        won: bool,
        xp_gained: u64,
    }

    public struct LevelUp has copy, drop {
        player: address,
        new_level: u64,
    }

    /// Error codes
    const EProfileExists: u64 = 1;
    const EProfileNotFound: u64 = 2;
    const EInvalidProof: u64 = 3;
    const EAlreadyClaimed: u64 = 4;
    const EInvalidDifficulty: u64 = 5;
    const EUnauthorized: u64 = 6;

    /// Constants
    const XP_PER_LEVEL: u64 = 100;
    const XP_EASY: u64 = 10;
    const XP_MEDIUM: u64 = 25;
    const XP_HARD: u64 = 50;
    const DIFFICULTY_EASY: u8 = 1;
    const DIFFICULTY_MEDIUM: u8 = 2;
    const DIFFICULTY_HARD: u8 = 3;

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
        
        let registry = GameRegistry {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            backend_public_key: backend_key,
            claim_records: table::new(ctx),
        };
        transfer::share_object(registry);
    }

    /// Create player profile
    public entry fun create_profile(ctx: &mut TxContext) {
        let player = tx_context::sender(ctx);
        
        let profile = PlayerProfile {
            id: object::new(ctx),
            owner: player,
            games_played: 0,
            games_won: 0,
            perfect_games: 0,
            current_streak: 0,
            longest_streak: 0,
            total_xp: 0,
            level: 1,
            last_daily_claim: 0,
        };

        event::emit(ProfileCreated { player });
        transfer::transfer(profile, player);
    }

    /// Submit game result with backend proof
    public entry fun submit_game_result(
        profile: &mut PlayerProfile,
        registry: &mut GameRegistry,
        score: u64,
        difficulty: u8,
        won: bool,
        is_perfect: bool,
        proof: vector<u8>,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        assert!(profile.owner == player, EProfileNotFound);

        // Validate difficulty
        assert!(
            difficulty == DIFFICULTY_EASY || 
            difficulty == DIFFICULTY_MEDIUM || 
            difficulty == DIFFICULTY_HARD,
            EInvalidDifficulty
        );

        // Verify backend proof
        verify_game_proof(&player, score, difficulty, won, &proof, &registry.backend_public_key);

        // Update stats
        profile.games_played = profile.games_played + 1;
        
        if (won) {
            profile.games_won = profile.games_won + 1;
            profile.current_streak = profile.current_streak + 1;
            
            if (profile.current_streak > profile.longest_streak) {
                profile.longest_streak = profile.current_streak;
            };
        } else {
            profile.current_streak = 0;
        };

        if (is_perfect) {
            profile.perfect_games = profile.perfect_games + 1;
        };

        // Calculate XP
        let xp_gained = calculate_xp(difficulty);
        let old_level = profile.level;
        profile.total_xp = profile.total_xp + xp_gained;
        profile.level = profile.total_xp / XP_PER_LEVEL + 1;

        // Emit events
        event::emit(GameResultSubmitted {
            player,
            score,
            won,
            xp_gained,
        });

        if (profile.level > old_level) {
            event::emit(LevelUp {
                player,
                new_level: profile.level,
            });
        };
    }

    /// Record NFT claim to prevent duplicates
    /// Only admin can record claims
    public entry fun record_claim(
        registry: &mut GameRegistry,
        player: address,
        claim_id: String,
        ctx: &mut TxContext
    ) {
        // Only admin can record claims
        assert!(tx_context::sender(ctx) == registry.admin, EUnauthorized);
        if (!table::contains(&registry.claim_records, player)) {
            table::add(&mut registry.claim_records, player, vector::empty());
        };

        let claims = table::borrow_mut(&mut registry.claim_records, player);
        assert!(!vector::contains(claims, &claim_id), EAlreadyClaimed);
        vector::push_back(claims, claim_id);
    }

    /// Check if NFT was already claimed
    public fun has_claimed(
        registry: &GameRegistry,
        player: address,
        claim_id: &String
    ): bool {
        if (!table::contains(&registry.claim_records, player)) {
            return false
        };

        let claims = table::borrow(&registry.claim_records, player);
        vector::contains(claims, claim_id)
    }

    /// Calculate XP based on difficulty
    /// Note: Difficulty is validated before calling this function
    fun calculate_xp(difficulty: u8): u64 {
        if (difficulty == DIFFICULTY_EASY) {
            XP_EASY
        } else if (difficulty == DIFFICULTY_MEDIUM) {
            XP_MEDIUM
        } else {
            XP_HARD
        }
    }

    /// Verify game proof
    fun verify_game_proof(
        player: &address,
        score: u64,
        difficulty: u8,
        won: bool,
        proof: &vector<u8>,
        public_key: &vector<u8>
    ) {
        let mut message = bcs::to_bytes(player);
        vector::append(&mut message, bcs::to_bytes(&score));
        vector::push_back(&mut message, difficulty);
        vector::push_back(&mut message, if (won) { 1 } else { 0 });

        assert!(
            ed25519::ed25519_verify(proof, public_key, &message),
            EInvalidProof
        );
    }

    /// Get player profile stats (view function)
    public fun get_stats(profile: &PlayerProfile): (u64, u64, u64, u64, u64, u64, u64) {
        (
            profile.games_played,
            profile.games_won,
            profile.perfect_games,
            profile.current_streak,
            profile.longest_streak,
            profile.total_xp,
            profile.level
        )
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
