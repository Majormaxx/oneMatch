# OneMatch Smart Contracts

Move smart contracts for the OneMatch decentralized memory game.

## Contracts

### Core (`onematch.move`)

Manages player profiles, game sessions, and XP progression.

**Key Functions**:

- `create_profile()`: Initialize player profile
- `submit_game_result()`: Record game completion with backend-verified proof
- `get_stats()`: View player statistics

### Leaderboard (`leaderboard.move`)

Tracks daily and all-time high scores.

**Key Functions**:

- `submit_score()`: Submit verified score to leaderboards
- `get_daily_rankings()`: Retrieve top daily scores
- `get_alltime_rankings()`: Retrieve all-time top scores

### Achievement NFT (`achievement_nft.move`)

Soulbound NFTs for player milestones.

**Key Functions**:

- `claim_achievement()`: Mint achievement NFT with proof
- `has_achievement()`: Check if player earned achievement
- `get_player_achievements()`: List all player achievements

### Collectible NFT (`collectible_nft.move`)

Tradeable NFT cards with rarity tiers.

**Key Functions**:

- `claim_collectible()`: Mint collectible NFT with proof
- `transfer_collectible()`: Transfer NFT to another player
- `get_collection_stats()`: View collection statistics

### Admin (`admin.move`)

Administrative controls and configuration.

## Build & Deploy

```bash
# Build
sui move build

# Test
sui move test

# Deploy to testnet
sui client publish --gas-budget 100000000
```

## Security Features

- Ed25519 signature verification
- Backend public key storage
- Difficulty validation
- Admin access control
- Gas optimizations

## Constants

### Difficulty Levels

- Easy: 1
- Medium: 2
- Hard: 3

### XP Rewards

- Easy: 10 XP
- Medium: 25 XP
- Hard: 50 XP

### Leaderboard

- Max entries: 100
- Daily reset: Automatic based on epoch timestamp
