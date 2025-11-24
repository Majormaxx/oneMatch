module onematch::leaderboard {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::bcs;
    use sui::ed25519;

    /// Leaderboard entry
    public struct LeaderboardEntry has store, copy, drop {
        player: address,
        score: u64,
        timestamp: u64,
        difficulty: u8,
    }

    /// Daily leaderboard
    public struct DailyLeaderboard has key {
        id: UID,
        day: u64,
        backend_public_key: vector<u8>,
        top_scores: vector<LeaderboardEntry>,
    }

    /// All-time leaderboard
    public struct AllTimeLeaderboard has key {
        id: UID,
        backend_public_key: vector<u8>,
        top_scores: vector<LeaderboardEntry>,
    }

    /// Events
    public struct ScoreSubmitted has copy, drop {
        player: address,
        score: u64,
        difficulty: u8,
        rank: u64,
    }

    /// Error codes
    const EInvalidProof: u64 = 1;
    const EInvalidDifficulty: u64 = 2;

    /// Constants
    const MAX_LEADERBOARD_SIZE: u64 = 100;
    const DIFFICULTY_EASY: u8 = 1;
    const DIFFICULTY_MEDIUM: u8 = 2;
    const DIFFICULTY_HARD: u8 = 3;
    const MS_PER_DAY: u64 = 86400000;  // 24 * 60 * 60 * 1000

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

        let daily_lb = DailyLeaderboard {
            id: object::new(ctx),
            day: get_current_day(ctx),
            backend_public_key: backend_key,
            top_scores: vector::empty(),
        };
        transfer::share_object(daily_lb);

        let alltime_lb = AllTimeLeaderboard {
            id: object::new(ctx),
            backend_public_key: backend_key,
            top_scores: vector::empty(),
        };
        transfer::share_object(alltime_lb);
    }

    /// Submit score to leaderboards
    public entry fun submit_score(
        daily_lb: &mut DailyLeaderboard,
        alltime_lb: &mut AllTimeLeaderboard,
        score: u64,
        difficulty: u8,
        proof: vector<u8>,
        ctx: &mut TxContext
    ) {
        let player = tx_context::sender(ctx);
        let current_day = get_current_day(ctx);
        
        // Validate difficulty
        assert!(
            difficulty == DIFFICULTY_EASY || 
            difficulty == DIFFICULTY_MEDIUM || 
            difficulty == DIFFICULTY_HARD,
            EInvalidDifficulty
        );

        // Verify backend proof
        verify_score_proof(&player, score, difficulty, &proof, &daily_lb.backend_public_key);

        // Check if daily leaderboard needs reset
        if (daily_lb.day != current_day) {
            daily_lb.day = current_day;
            daily_lb.top_scores = vector::empty();
        };

        // Create entry
        let entry = LeaderboardEntry {
            player,
            score,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
            difficulty,
        };

        // Add to daily leaderboard
        let daily_rank = insert_score(&mut daily_lb.top_scores, entry);

        // Add to all-time leaderboard
        insert_score(&mut alltime_lb.top_scores, entry);

        // Emit event
        event::emit(ScoreSubmitted {
            player,
            score,
            difficulty,
            rank: daily_rank,
        });
    }

    /// Insert score into leaderboard (sorted by score descending)
    fun insert_score(scores: &mut vector<LeaderboardEntry>, entry: LeaderboardEntry): u64 {
        let len = vector::length(scores);
        let mut pos = 0;

        // Find insertion position
        while (pos < len) {
            let existing = vector::borrow(scores, pos);
            if (entry.score > existing.score) {
                break
            };
            pos = pos + 1;
        };

        // Insert at position
        if (pos < MAX_LEADERBOARD_SIZE) {
            if (pos < len) {
                vector::insert(scores, entry, pos);
            } else {
                vector::push_back(scores, entry);
            };

            // Trim if exceeds max size
            if (vector::length(scores) > MAX_LEADERBOARD_SIZE) {
                vector::pop_back(scores);
            };
        };

        pos
    }

    /// Get daily rankings
    public fun get_daily_rankings(
        daily_lb: &DailyLeaderboard,
        count: u64
    ): vector<LeaderboardEntry> {
        let len = vector::length(&daily_lb.top_scores);
        let limit = if (count < len) { count } else { len };
        
        let mut result = vector::empty();
        let mut i = 0;
        while (i < limit) {
            vector::push_back(&mut result, *vector::borrow(&daily_lb.top_scores, i));
            i = i + 1;
        };
        
        result
    }

    /// Get all-time rankings
    public fun get_alltime_rankings(
        alltime_lb: &AllTimeLeaderboard,
        count: u64
    ): vector<LeaderboardEntry> {
        let len = vector::length(&alltime_lb.top_scores);
        let limit = if (count < len) { count } else { len };
        
        let mut result = vector::empty();
        let mut i = 0;
        while (i < limit) {
            vector::push_back(&mut result, *vector::borrow(&alltime_lb.top_scores, i));
            i = i + 1;
        };
        
        result
    }

    /// Get player's current rank in daily leaderboard
    public fun get_player_daily_rank(
        daily_lb: &DailyLeaderboard,
        player: address
    ): u64 {
        let len = vector::length(&daily_lb.top_scores);
        let mut i = 0;
        
        while (i < len) {
            let entry = vector::borrow(&daily_lb.top_scores, i);
            if (entry.player == player) {
                return i + 1
            };
            i = i + 1;
        };
        
        0 // Not ranked
    }

    /// Get current day (epoch day)
    fun get_current_day(ctx: &TxContext): u64 {
        tx_context::epoch_timestamp_ms(ctx) / MS_PER_DAY
    }

    /// Verify score proof
    fun verify_score_proof(
        player: &address,
        score: u64,
        difficulty: u8,
        proof: &vector<u8>,
        public_key: &vector<u8>
    ) {
        let mut message = bcs::to_bytes(player);
        vector::append(&mut message, bcs::to_bytes(&score));
        vector::push_back(&mut message, difficulty);

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
