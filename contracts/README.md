# Move Smart Contracts

Move smart contracts for the OneMatch dApp on [OneChain](https://onelabs.cc/), a Sui-based Layer 1 blockchain.

## Prerequisites

Install the Sui CLI:

```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

## Commands

```bash
sui move build                                    # Build contracts
sui move test                                     # Run tests
sui client publish --gas-budget 100000000         # Publish to network
```

## Configuration

Update `Move.toml` with your module addresses before deployment.
