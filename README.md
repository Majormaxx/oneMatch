# OneMatch

A decentralized memory matching game built on Sui blockchain with NFT rewards and competitive leaderboards.

## Features

- **Progressive Difficulty**: Three difficulty levels (Easy: 4x3, Medium: 4x4, Hard: 6x4)
- **Smart Scoring System**: Time bonuses, streak rewards, and perfect game incentives
- **Achievement NFTs**: Soulbound tokens for milestones
- **Collectible NFTs**: Tradeable rare cards with probability-based drops
- **Global Leaderboards**: Daily and all-time rankings
- **OneChain Education**: Learn DeFi concepts while playing

## Smart Contracts

Built with Move language for the Sui blockchain.

### Modules

- **core** (`onematch.move`): Player profiles, game results, XP system
- **leaderboard** (`leaderboard.move`): Daily and all-time score tracking
- **achievement_nft** (`achievement_nft.move`): Soulbound achievement tokens
- **collectible_nft** (`collectible_nft.move`): Tradeable collectible cards
- **admin** (`admin.move`): Administrative functions

### Build

```bash
cd contracts
sui move build
```

### Test

```bash
sui move test
```

### Deploy

```bash
sui client publish --gas-budget 100000000
```

## Tech Stack

- **Blockchain**: Sui
- **Smart Contracts**: Move
- **Frontend**: Next.js 16, React 19
- **Wallet**: @mysten/dapp-kit

## Security

- Ed25519 signature verification for game results
- Admin-only NFT claim recording
- Difficulty validation
- Optimized gas usage

## License

MIT
