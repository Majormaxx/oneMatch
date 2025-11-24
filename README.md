# OneMatch dApp

A decentralized application built with Move smart contracts and Next.js frontend, integrated with OneWallet.

## Project Structure

```
oneMatch/
├── frontend/          # Next.js frontend application
├── contracts/         # Move smart contracts
├── package.json       # Workspace configuration
└── README.md         # This file
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Move CLI (for smart contract development)

## Getting Started

### Frontend Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Smart Contract Development

```bash
cd contracts
# Add Move CLI commands here based on your blockchain (Aptos/Sui)
```

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Smart Contracts**: Move
- **Wallet**: OneWallet integration
- **Styling**: CSS

## Development

The project uses npm workspaces for monorepo management. Each package can be developed independently while sharing common dependencies.
