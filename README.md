# 🎮 Fleet SDK Educational Tutorial

[![Tests](https://img.shields.io/badge/tests-86%20passing-brightgreen)](./tests)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Fleet SDK](https://img.shields.io/badge/Fleet%20SDK-v0.6.4-blue)](https://github.com/fleet-sdk/fleet)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

> **🏆 Unstoppable Hackathon 2025 Submission**  
> **Bounty:** Fleet SDK Quest - Educational Tutorial (Σ1,578)  
> **Track:** Open Contribution

```
    ⚔️ FLEET SDK QUEST ⚔️
      ╔═══════════════╗
      ║  Level Up Your ║
      ║  Ergo Skills!  ║
      ╚═══════════════╝
         /█\  🎮
        █████  
       ███████ 
         |||   
```

## 📖 Overview

A **comprehensive, gamified educational tutorial** for learning the [Fleet SDK](https://github.com/fleet-sdk/fleet) - the most powerful TypeScript library for building Ergo blockchain applications.

### ✨ Key Features

- 🎮 **Gamified Learning** - Earn XP as you complete tutorials and tests
- 📚 **4 Progressive Tutorials** - From basics to smart contracts
- 💻 **9 Working Examples** - Real, runnable code
- 🧪 **86 Passing Tests** - Comprehensive test coverage
- 📖 **VitePress Documentation** - Interactive docs site
- 🔗 **Real Fleet SDK Patterns** - Sourced from official repositories

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/fleet-sdk-tutorial.git
cd fleet-sdk-tutorial

# Install dependencies
npm install

# Run tests to verify setup
npm test

# Start the documentation site
npm run docs:dev
```

### First Steps

```bash
# 1. Run all 86 tests
npm test

# 2. Start interactive docs
npm run docs:dev

# 3. Run your first example
npm run example:basic

# 4. Start the gamified quest
npm run quest:start
```

---

## 📚 Tutorials

| # | Tutorial | Difficulty | Time | XP |
|---|----------|------------|------|-----|
| 1 | [First Transaction](./docs/tutorials/01-first-transaction.md) | ⭐⭐ | 30 min | 100 |
| 2 | [Token Operations](./docs/tutorials/02-token-operations.md) | ⭐⭐⭐ | 45 min | 150 |
| 3 | [NFT Minting](./docs/tutorials/03-nft-minting.md) | ⭐⭐⭐ | 45 min | 150 |
| 4 | [Smart Contracts](./docs/tutorials/04-smart-contracts.md) | ⭐⭐⭐⭐ | 60 min | 200 |

---

## 💻 Code Examples

| Example | Description | Run Command |
|---------|-------------|-------------|
| [Basic Transfer](./examples/01-basic-transfer.ts) | Simple ERG transfer | `npm run example:basic` |
| [Multi-Output](./examples/02-multi-output-tx.ts) | Multiple recipients | `npm run example:multi` |
| [Token Transfer](./examples/03-token-transfer.ts) | Native tokens | `npm run example:token` |
| [NFT Minting](./examples/04-nft-minting.ts) | Create NFTs | `npm run example:nft` |
| [Contracts](./examples/05-contract-interaction.ts) | ErgoScript | `npm run example:contract` |
| [Multi-Sig](./examples/06-multi-sig-wallet.ts) | Team wallets | `npm run example:multisig` |
| [Oracle Data](./examples/07-oracle-data-fetch.ts) | Real-world data | `npm run example:oracle` |
| [DeFi Swap](./examples/08-defi-swap.ts) | Token swapping | `npm run example:defi` |
| [Advanced Patterns](./examples/advanced-patterns.ts) | Production patterns | - |

---

## 🧪 Test Suite

```bash
npm test
```

### Test Files

| File | Tests | XP Available |
|------|-------|--------------|
| `basic-transfer.test.ts` | 7 | 80 XP |
| `token-operations.test.ts` | 8 | 160 XP |
| `mock-chain.test.ts` | 8 | - |
| `fleet-sdk-patterns.test.ts` | 30 | 395 XP |
| `mock-chain-advanced.test.ts` | 20 | 300 XP |
| `utils.test.ts` | 13 | - |
| **Total** | **86** | **935+ XP** |

### Test Categories

- ✅ **Core Patterns** - TransactionBuilder, OutputBuilder, ErgoAddress
- ✅ **Token Operations** - Minting, transfers, NFTs (EIP-4)
- ✅ **MockChain** - Simulated blockchain testing
- ✅ **SigmaUSD Protocol** - Oracle rates, bank box patterns
- ✅ **Utilities** - Address validation, fee calculation

---

## 📦 Fleet SDK Packages Used

| Package | Version | Purpose |
|---------|---------|---------|
| `@fleet-sdk/core` | 0.6.4 | Transaction building |
| `@fleet-sdk/wallet` | 0.6.4 | Key management |
| `@fleet-sdk/common` | 0.6.4 | Shared utilities |
| `@fleet-sdk/crypto` | 0.6.4 | Cryptographic functions |
| `@fleet-sdk/serializer` | 0.6.4 | Data serialization |
| `@fleet-sdk/mock-chain` | 0.6.4 | Testing utilities |
| `@fleet-sdk/compiler` | 0.6.4 | ErgoScript compiler |
| `@fleet-sdk/blockchain-providers` | 0.6.4 | Data providers |

---

## 🗂️ Project Structure

```
fleet-sdk-tutorial/
├── 📁 docs/                    # VitePress documentation
│   ├── tutorials/              # Step-by-step guides
│   ├── concepts/               # Core concepts
│   ├── examples/               # Example explanations
│   ├── testing/                # Testing guides
│   ├── troubleshooting/        # Common issues
│   └── playground/             # Interactive playground
├── 📁 examples/                # Runnable code examples (9 files)
├── �� tests/                   # Test suite (86 tests)
│   ├── fleet-sdk-patterns.test.ts  # Real Fleet SDK patterns
│   ├── mock-chain-advanced.test.ts # MockChain patterns
│   └── test-vectors.ts         # Real mainnet data
├── 📁 src/                     # Source utilities
├── package.json
├── vitest.config.ts
└── README.md
```

---

## 🎓 Learning Path

```
🎮 FLEET SDK QUEST - SKILL TREE
================================

Level 1: Novice (0-200 XP)
├── ✅ Understand UTXO model
├── ✅ Create first wallet  
└── ✅ Send basic transaction

Level 2: Apprentice (200-500 XP)
├── ✅ Work with tokens
├── ✅ Mint NFTs (EIP-4)
└── ✅ Handle multiple outputs

Level 3: Journeyman (500-800 XP)
├── ✅ Use MockChain for testing
├── ✅ Interact with oracles
└── ✅ Build multi-sig wallets

Level 4: Master (800+ XP)
├── ✅ ErgoScript contracts
├── ✅ SigmaUSD protocol patterns
└── ✅ Production dApp patterns
```

---

## 🔗 Authentic Patterns

This tutorial uses **real patterns** from official repositories:

- **[fleet-sdk/fleet](https://github.com/fleet-sdk/fleet)** - TransactionBuilder, OutputBuilder, MockChain
- **[ergoplatform/ergo](https://github.com/ergoplatform/ergo)** - ErgoScript, Sigma protocol
- **SigmaUSD Protocol** - Oracle rates, bank box structure

### Real Test Data Included

```typescript
// Real addresses from Fleet SDK tests
const REAL_ADDRESS = "9hXBB1FS1UT5kiopced1LYXgPDoFgoFQsGnqPCbRaLZZ1YbJJHD";

// Real token IDs from mainnet
const SIGUSD = "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04";
const SIGRSV = "003bd19d0187117f130b62e1bcab0939929ff5c7709f843c5c4dd158949285d0";
```

---

## 🐛 Troubleshooting

See [Common Issues](./docs/troubleshooting/common-issues.md) for solutions.

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📄 License

[MIT License](./LICENSE) - Free to use for learning and building!

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| Fleet SDK Docs | [fleet-sdk.github.io](https://fleet-sdk.github.io/docs/) |
| Ergo Platform | [docs.ergoplatform.com](https://docs.ergoplatform.com/) |
| Ergo Explorer | [explorer.ergoplatform.com](https://explorer.ergoplatform.com/) |
| Testnet Faucet | [testnet.ergoplatform.com/faucet](https://testnet.ergoplatform.com/en/faucet/) |
| Fleet SDK GitHub | [github.com/fleet-sdk/fleet](https://github.com/fleet-sdk/fleet) |

---

<div align="center">

**Created with ❤️ for the Ergo Community**

🏆 **Unstoppable Hackathon 2025** | **Fleet SDK Quest** | **Σ1,578 Bounty**

</div>
