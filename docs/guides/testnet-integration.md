# 🌐 Testnet Integration

Connect to the Ergo testnet for real blockchain interactions! This guide shows you how to use the built-in testnet integration module.

## Overview

The testnet integration provides:
- **Fetch UTXOs** - Get real unspent boxes from addresses
- **Get Box by ID** - Retrieve specific boxes from the blockchain
- **Query Token Info** - Look up token metadata
- **Submit Transactions** - Send transactions to testnet
- **Check TX Status** - Verify transaction confirmations

## Quick Start

### Using the CLI

```bash
# Check testnet connection
npm run testnet

# Or run specific operations
npx ts-node src/testnet-integration.ts
```

### Using the API Client

```typescript
import { ErgoExplorerClient } from "../src/testnet-integration";

// Initialize client (testnet by default)
const client = new ErgoExplorerClient("testnet");

// Fetch UTXOs for an address
const address = "3WvsT2Gm4EpsM9Pg18PdY6XyhNNMqXDsvJTbbf6ihLvAmSb7u5RN";
const utxos = await client.getUTXOs(address);

console.log(`Found ${utxos.length} UTXOs`);
for (const box of utxos) {
  console.log(`- Box: ${box.boxId.slice(0, 8)}... Value: ${box.value} nanoERG`);
}
```

## API Reference

### ErgoExplorerClient

The main client class for interacting with Ergo Explorer API.

#### Constructor

```typescript
const client = new ErgoExplorerClient(network: "mainnet" | "testnet");
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| network | `"mainnet"` \| `"testnet"` | `"testnet"` | Which network to connect to |

#### Methods

##### getUTXOs(address: string)

Fetch unspent transaction outputs for an address.

```typescript
const utxos = await client.getUTXOs("9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8y");

// Returns: Array of Box objects
// {
//   boxId: string,
//   value: string,
//   ergoTree: string,
//   assets: Array<{ tokenId: string, amount: string }>,
//   creationHeight: number,
//   additionalRegisters: object
// }
```

##### getBoxById(boxId: string)

Retrieve a specific box by its ID.

```typescript
const box = await client.getBoxById("abc123...");

if (box) {
  console.log("Box value:", box.value);
  console.log("Tokens:", box.assets.length);
}
```

##### getTokenInfo(tokenId: string)

Look up token metadata.

```typescript
const token = await client.getTokenInfo("tokenId...");

// Returns token info:
// {
//   id: string,
//   name: string,
//   description: string,
//   decimals: number,
//   emissionAmount: string
// }
```

##### submitTransaction(signedTx: SignedTransaction)

Submit a signed transaction to the network.

```typescript
const txId = await client.submitTransaction(signedTx);
console.log("Transaction submitted:", txId);
```

##### getTransactionStatus(txId: string)

Check if a transaction is confirmed.

```typescript
const status = await client.getTransactionStatus("txId...");

// Returns: { confirmed: boolean, confirmations: number }
if (status.confirmed) {
  console.log(`Confirmed with ${status.confirmations} confirmations`);
}
```

## Network Configuration

### Testnet (Default)

```typescript
const testnetClient = new ErgoExplorerClient("testnet");
// Uses: https://api-testnet.ergoplatform.com
```

### Mainnet

```typescript
const mainnetClient = new ErgoExplorerClient("mainnet");
// Uses: https://api.ergoplatform.com
```

## Complete Example: Build & Submit Transaction

```typescript
import { TransactionBuilder, OutputBuilder } from "@fleet-sdk/core";
import { ErgoExplorerClient } from "../src/testnet-integration";

async function sendErg() {
  const client = new ErgoExplorerClient("testnet");
  
  // 1. Fetch UTXOs for sender
  const senderAddress = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8y";
  const utxos = await client.getUTXOs(senderAddress);
  
  if (utxos.length === 0) {
    throw new Error("No UTXOs found! Get testnet ERG from faucet.");
  }
  
  // 2. Build transaction
  const recipientAddress = "3WvsT2Gm4EpsM9Pg18PdY6XyhNNMqXDsvJTbbf6ihLvAmSb7u5RN";
  
  const unsignedTx = new TransactionBuilder(1100000)
    .from(utxos)
    .to(
      new OutputBuilder(
        "1000000000", // 1 ERG
        recipientAddress
      )
    )
    .sendChangeTo(senderAddress)
    .payFee("1100000")
    .build();
  
  console.log("Transaction built!");
  console.log("Inputs:", unsignedTx.inputs.length);
  console.log("Outputs:", unsignedTx.outputs.length);
  
  // 3. Sign transaction (requires wallet)
  // const signedTx = wallet.sign(unsignedTx);
  
  // 4. Submit to network
  // const txId = await client.submitTransaction(signedTx);
  // console.log("Submitted:", txId);
  
  return unsignedTx;
}
```

## Getting Testnet ERG

To test on testnet, you need testnet ERG:

1. **Ergo Testnet Faucet**: Visit the [Ergo Testnet Faucet](https://testnet-faucet.ergoplatform.com)
2. **Enter your testnet address** 
3. **Receive test ERG** (usually arrives within a minute)

::: tip Testnet Addresses
Testnet addresses start with `3` (P2PK) or `8` (P2S), while mainnet addresses start with `9`.
:::

## Error Handling

```typescript
import { ErgoExplorerClient } from "../src/testnet-integration";

const client = new ErgoExplorerClient("testnet");

try {
  const utxos = await client.getUTXOs("invalidAddress");
} catch (error) {
  if (error.message.includes("404")) {
    console.log("Address not found or has no UTXOs");
  } else {
    console.error("Network error:", error.message);
  }
}
```

## Rate Limiting

The Ergo Explorer API has rate limits. For heavy usage:

- Add delays between requests
- Cache responses when possible
- Use pagination for large result sets

```typescript
// Example: Rate-limited batch fetch
async function fetchAllUTXOs(addresses: string[]) {
  const results = [];
  
  for (const addr of addresses) {
    const utxos = await client.getUTXOs(addr);
    results.push({ address: addr, utxos });
    
    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return results;
}
```

## Next Steps

- [Build Your First Transaction](/tutorials/01-first-transaction)
- [Token Operations](/tutorials/02-token-operations)
- [View Your Progress](/guides/leaderboard)
- [Try the Playground](/playground/)
