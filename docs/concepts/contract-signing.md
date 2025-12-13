# 🔐 Contract Signing

> Sign transactions with secret keys for smart contract interactions

## Overview

When interacting with smart contracts, you need to:
1. Build the transaction
2. Sign it with appropriate keys
3. Submit to the network

```
┌─────────────────────────────────────────────────────────────┐
│                   SIGNING FLOW                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│   │ Unsigned │───▶│  Prover  │───▶│  Signed  │            │
│   │    Tx    │    │ + Secret │    │    Tx    │            │
│   └──────────┘    └──────────┘    └──────────┘            │
│                         │                                   │
│                    Secret Key                               │
│                    or Wallet                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Signing Methods

### 1. With EIP-12 Wallet (Nautilus, etc.)

```typescript
// Connect to wallet
await ergoConnector.nautilus.connect();

// Build unsigned transaction
const unsignedTx = new TransactionBuilder(height)
  .from(inputs)
  .to(output)
  .sendChangeTo(address)
  .payFee()
  .build();

// Sign with wallet
const signedTx = await ergo.signTx(unsignedTx);

// Submit
const txId = await ergo.submitTx(signedTx);
console.log("Transaction ID:", txId);
```

### 2. With Secret Key (Backend)

```typescript
import { SecretKey, Prover } from "@fleet-sdk/wallet";
import { TransactionBuilder, OutputBuilder } from "@fleet-sdk/core";

// Your secret key (NEVER expose in frontend!)
const secretKeyHex = "your_secret_key_hex";
const secretKey = SecretKey.fromHex(secretKeyHex);

// Create prover
const prover = new Prover(secretKey);

// Build transaction
const unsignedTx = new TransactionBuilder(currentHeight)
  .from(inputs)
  .to(new OutputBuilder("1000000000", recipient))
  .sendChangeTo(myAddress)
  .payFee("1100000")
  .build();

// Sign
const signedTx = prover.sign(unsignedTx);

// Submit to node
const response = await fetch("http://node:9053/transactions", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(signedTx)
});
```

## Contract Spending

When spending from a contract, you may need to satisfy script conditions:

```typescript
// Contract that requires specific context
const contractBox = await fetchContractBox();

// Build spending transaction
const tx = new TransactionBuilder(height)
  .from([contractBox])  // Contract box as input
  .to(
    new OutputBuilder(outputValue, recipient)
  )
  .sendChangeTo(changeAddress)
  .payFee()
  .build();

// Sign - prover must satisfy contract conditions
const signedTx = prover.sign(tx);
```

## Multi-Signature

For contracts requiring multiple signatures:

```typescript
import { SecretKey, Prover, MultiProver } from "@fleet-sdk/wallet";

// Multiple secret keys
const key1 = SecretKey.fromHex(secretKey1Hex);
const key2 = SecretKey.fromHex(secretKey2Hex);

// Create multi-prover
const prover = new MultiProver([key1, key2]);

// Sign requires all keys
const signedTx = prover.sign(unsignedTx);
```

## Hints for Complex Scripts

Some scripts need hints to guide signing:

```typescript
const signedTx = prover.sign(unsignedTx, {
  // Provide hints for script evaluation
  hints: {
    secretHints: [...],
    publicHints: [...]
  }
});
```

## Security Best Practices

| Do | Don't |
|----|-------|
| ✅ Keep secrets server-side | ❌ Expose keys in frontend |
| ✅ Use wallet for user txs | ❌ Store keys in localStorage |
| ✅ Validate before signing | ❌ Sign arbitrary data |
| ✅ Use hardware wallets | ❌ Share secret keys |

## ErgoPay for Mobile

For mobile wallet signing, see [Reduced Tx & ErgoPay](./reduced-tx-ergopay).

## Example: Complete Flow

```typescript
import { 
  TransactionBuilder, 
  OutputBuilder,
  ErgoAddress 
} from "@fleet-sdk/core";
import { SecretKey, Prover } from "@fleet-sdk/wallet";

async function sendErg(
  secretKeyHex: string,
  recipient: string,
  amount: string
) {
  // 1. Setup
  const secretKey = SecretKey.fromHex(secretKeyHex);
  const prover = new Prover(secretKey);
  const myAddress = secretKey.getAddress().toString();
  
  // 2. Fetch inputs from blockchain
  const inputs = await fetchUtxos(myAddress);
  const currentHeight = await getCurrentHeight();
  
  // 3. Build transaction
  const unsignedTx = new TransactionBuilder(currentHeight)
    .from(inputs)
    .to(new OutputBuilder(amount, recipient))
    .sendChangeTo(myAddress)
    .payFee("1100000")
    .build();
  
  // 4. Sign
  const signedTx = prover.sign(unsignedTx);
  
  // 5. Submit
  const txId = await submitTx(signedTx);
  
  return txId;
}
```

## Next Steps

- [Smart Contracts](/tutorials/04-smart-contracts) - Contract interaction tutorial
- [ErgoPay Integration](./reduced-tx-ergopay) - Mobile signing
- [Data Inputs](./data-inputs) - Reference external data
