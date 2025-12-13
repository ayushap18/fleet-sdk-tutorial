# 🧪 Code Examples

> Ready-to-run TypeScript examples for common Fleet SDK operations

## Getting Started

All examples are in the `/examples` directory and can be run individually:

```bash
# Install dependencies
pnpm install

# Run any example
pnpm tsx examples/01-basic-transfer.ts
```

## Example Overview

| # | Example | Description | Difficulty |
|---|---------|-------------|------------|
| 01 | [Basic Transfer](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/01-basic-transfer.ts) | Send ERG to an address | 🟢 Easy |
| 02 | [Multi-Output](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/02-multi-output-tx.ts) | Batch payments to multiple recipients | 🟢 Easy |
| 03 | [Token Transfer](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/03-token-transfer.ts) | Send native tokens | 🟡 Medium |
| 04 | [NFT Minting](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/04-nft-minting.ts) | Create EIP-4 NFTs | 🟡 Medium |
| 05 | [Contract Interaction](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/05-contract-interaction.ts) | Compile & use ErgoScript | 🟠 Advanced |
| 06 | [Multi-Sig Wallet](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/06-multi-sig-wallet.ts) | 2-of-3 signature scheme | 🟠 Advanced |
| 07 | [Oracle Data](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/07-oracle-data-fetch.ts) | Read on-chain oracle prices | 🟠 Advanced |
| 08 | [DeFi Swap](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/08-defi-swap.ts) | AMM token swaps | 🔴 Expert |

---

## 🟢 Basic Examples

### 01 - Basic Transfer

The simplest transaction: send ERG from one address to another.

**Key Concepts:**
- TransactionBuilder basics
- Input selection
- Output creation
- Fee handling
- Change address

```typescript
import { TransactionBuilder, OutputBuilder } from "@fleet-sdk/core";

const tx = new TransactionBuilder(currentHeight)
  .from(inputs)
  .to(new OutputBuilder(1_000_000_000n, recipientAddress))
  .sendChangeTo(senderAddress)
  .payFee(RECOMMENDED_MIN_FEE_VALUE)
  .build();
```

[View Full Example →](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/01-basic-transfer.ts)

---

### 02 - Multi-Output Transaction

Send to multiple recipients in a single transaction.

**Key Concepts:**
- Multiple OutputBuilders
- Batch processing
- Gas efficiency

```typescript
const recipients = [
  { address: "addr1...", amount: 1_000_000_000n },
  { address: "addr2...", amount: 2_000_000_000n },
  { address: "addr3...", amount: 500_000_000n }
];

const outputs = recipients.map(r => 
  new OutputBuilder(r.amount, r.address)
);

const tx = new TransactionBuilder(height)
  .from(inputs)
  .to(outputs)
  .sendChangeTo(sender)
  .payFee(fee)
  .build();
```

[View Full Example →](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/02-multi-output-tx.ts)

---

## 🟡 Token Examples

### 03 - Token Transfer

Send native Ergo tokens alongside ERG.

**Key Concepts:**
- Token handling
- `.addTokens()` method
- Token change management

```typescript
const tokenOutput = new OutputBuilder(SAFE_MIN_BOX_VALUE, recipient)
  .addTokens({
    tokenId: "03faf2cb...",
    amount: 100n
  });
```

[View Full Example →](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/03-token-transfer.ts)

---

### 04 - NFT Minting

Create EIP-4 compliant NFTs with metadata.

**Key Concepts:**
- EIP-4 standard
- Register encoding (R4-R9)
- NFT artwork types

```typescript
import { first } from "@fleet-sdk/common";

const nftOutput = new OutputBuilder(SAFE_MIN_BOX_VALUE, minter)
  .mintToken({
    amount: 1n,
    name: "My NFT"
  })
  .setAdditionalRegisters({
    R4: SColl(SByte, utf8.decode("NFT Name")).toHex(),
    R5: SColl(SByte, utf8.decode("Description")).toHex(),
    R6: SColl(SByte, utf8.decode("0")).toHex(),  // Decimals
    R7: SColl(SByte, Buffer.from([1, 2])).toHex(), // Type
    R8: SColl(SByte, utf8.decode("ipfs://...")).toHex()
  });
```

[View Full Example →](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/04-nft-minting.ts)

---

## 🟠 Advanced Examples

### 05 - Contract Interaction

Compile ErgoScript and interact with smart contracts.

**Key Concepts:**
- ErgoScript compilation
- Contract address derivation
- Spending from contracts

```typescript
import { compile } from "@fleet-sdk/compiler";

const script = `{
  val ownerPk = PK("9f...")
  sigmaProp(HEIGHT > 1500000L && ownerPk)
}`;

const compiled = compile(script);
const contractAddress = compiled.address;
```

[View Full Example →](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/05-contract-interaction.ts)

---

### 06 - Multi-Sig Wallet

Implement 2-of-3 multi-signature wallets.

**Key Concepts:**
- Multi-sig ErgoScript
- Aggregated signatures
- Team treasury management

```typescript
const multiSigScript = `{
  val alice = PK("9fAAA...")
  val bob = PK("9fBBB...")
  val charlie = PK("9fCCC...")
  
  sigmaProp(atLeast(2, Coll(alice, bob, charlie)))
}`;
```

[View Full Example →](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/06-multi-sig-wallet.ts)

---

### 07 - Oracle Data Fetch

Read price data from on-chain oracles.

**Key Concepts:**
- Oracle pool mechanics
- Register decoding
- Price feed integration

```typescript
// Oracle boxes store price in R4
const priceData = oracleBox.additionalRegisters.R4;
const decodedPrice = decode(priceData);
```

[View Full Example →](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/07-oracle-data-fetch.ts)

---

## 🔴 Expert Examples

### 08 - DeFi Swap

Interact with AMM DEXes for token swaps.

**Key Concepts:**
- Constant product formula
- Slippage calculation
- Swap transaction structure

```typescript
// x * y = k (constant product)
function calculateOutput(
  inputAmount: bigint,
  inputReserve: bigint,
  outputReserve: bigint,
  feePercent: bigint = 3n
): bigint {
  const inputWithFee = inputAmount * (1000n - feePercent);
  const numerator = inputWithFee * outputReserve;
  const denominator = inputReserve * 1000n + inputWithFee;
  return numerator / denominator;
}
```

[View Full Example →](https://github.com/fleet-sdk/fleet-sdk-tutorial/blob/main/examples/08-defi-swap.ts)

---

## Running Examples

### Prerequisites

```bash
# Node.js 18+
node --version

# pnpm (recommended)
npm install -g pnpm
```

### Quick Start

```bash
# Clone and install
git clone <repo>
cd fleet-sdk-tutorial
pnpm install

# Run an example
pnpm tsx examples/01-basic-transfer.ts

# Run with watch mode (auto-reload)
pnpm tsx watch examples/01-basic-transfer.ts
```

### Testnet Usage

All examples are configured for testnet. Get testnet ERG from:
- [Ergo Testnet Faucet](https://testnet.ergoplatform.com/en/faucet/)

---

## Common Issues

Having trouble? Check our [Troubleshooting Guide](../troubleshooting/common-issues.md) for solutions to common problems.
