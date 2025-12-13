# 📋 Fleet SDK Cheat Sheet

> Quick reference for common Fleet SDK operations

## Quick Navigation

- [Transaction Building](#transaction-building)
- [Output Builder](#output-builder)
- [Box Selection](#box-selection)
- [Token Operations](#token-operations)
- [Registers](#registers)
- [Addresses](#addresses)
- [Signing](#signing)
- [Common Patterns](#common-patterns)

---

## Transaction Building

```typescript
import { TransactionBuilder, OutputBuilder } from "@fleet-sdk/core";

// Basic transaction
const tx = new TransactionBuilder(currentHeight)
  .from(inputs)                    // Input boxes
  .to(output)                      // Output box(es)
  .sendChangeTo(address)           // Change address
  .payFee("1100000")              // Fee (≥1.1 mERG)
  .build();                        // Build unsigned tx
```

### TransactionBuilder Methods

| Method | Description | Example |
|--------|-------------|---------|
| `.from(boxes)` | Add input boxes | `.from(userBoxes)` |
| `.to(output)` | Add output box | `.to(outputBuilder)` |
| `.sendChangeTo(addr)` | Set change address | `.sendChangeTo("9f...")` |
| `.payFee(amount)` | Set transaction fee | `.payFee("1100000")` |
| `.withDataFrom(box)` | Add data input | `.withDataFrom(oracleBox)` |
| `.build()` | Build transaction | `.build()` |
| `.configure(fn)` | Advanced config | `.configure(s => s.isolateErgChange())` |

---

## Output Builder

```typescript
// Basic output
new OutputBuilder("1000000000", recipientAddress)

// With tokens
new OutputBuilder("1000000000", address)
  .addTokens({ tokenId: "...", amount: "100" })

// With registers
new OutputBuilder("1000000000", address)
  .setAdditionalRegisters({
    R4: SInt(42),
    R5: SColl(SByte, [1, 2, 3])
  })
```

### OutputBuilder Methods

| Method | Description |
|--------|-------------|
| `.addTokens(token)` | Add tokens to output |
| `.mintToken(token)` | Mint new token |
| `.setAdditionalRegisters(regs)` | Set R4-R9 registers |
| `.setValue(amount)` | Update ERG value |

---

## Box Selection

```typescript
import { BoxSelector, ErgoBoxes } from "@fleet-sdk/core";

// Select by ERG amount
const selector = new BoxSelector(boxes)
  .select({ nanoErgs: "5000000000" });  // Select 5 ERG worth

// Select by tokens
const selector = new BoxSelector(boxes)
  .select({ tokens: [{ tokenId: "abc", amount: "10" }] });

// Combined selection
const selected = new BoxSelector(boxes)
  .select({
    nanoErgs: "1000000000",
    tokens: [{ tokenId: "abc", amount: "5" }]
  });
```

---

## Token Operations

### Mint Token

```typescript
const tx = new TransactionBuilder(height)
  .from(inputs)
  .to(
    new OutputBuilder("1000000", address)
      .mintToken({
        name: "MyToken",
        description: "A cool token",
        amount: "1000000",
        decimals: 2
      })
  )
  .sendChangeTo(address)
  .payFee()
  .build();
```

### Burn Token

```typescript
const tx = new TransactionBuilder(height)
  .from(inputs)
  .burnTokens({ tokenId: "...", amount: "100" })
  .sendChangeTo(address)
  .payFee()
  .build();
```

### Transfer Token

```typescript
const tx = new TransactionBuilder(height)
  .from(inputs)
  .to(
    new OutputBuilder("1000000", recipient)
      .addTokens({ tokenId: "...", amount: "50" })
  )
  .sendChangeTo(sender)
  .payFee()
  .build();
```

---

## Registers

### Type Constructors

```typescript
import {
  SInt, SLong, SByte, SBool,
  SColl, SGroupElement, SSigmaProp
} from "@fleet-sdk/core";

// Primitives
SInt(42)           // Int
SLong(1000000n)    // Long (bigint)
SByte(255)         // Byte
SBool(true)        // Boolean

// Collections
SColl(SByte, [1, 2, 3, 4])           // Coll[Byte]
SColl(SInt, [10, 20, 30])            // Coll[Int]
SColl(SLong, [100n, 200n])           // Coll[Long]

// Crypto
SGroupElement("0279be667...")        // Group element
SSigmaProp(SGroupElement("..."))     // SigmaProp
```

### Register Usage

```typescript
new OutputBuilder(value, address)
  .setAdditionalRegisters({
    R4: SInt(42),                        // Integer
    R5: SColl(SByte, hexToBytes("...")), // Bytes
    R6: SLong(BigInt(Date.now())),       // Timestamp
    R7: SBool(true),                     // Boolean
    R8: SColl(SByte, utf8ToBytes("Hi")), // String
    R9: SGroupElement(publicKey)         // Public key
  })
```

---

## Addresses

```typescript
import { ErgoAddress, Network } from "@fleet-sdk/core";

// Create from string
const addr = ErgoAddress.fromBase58("9f4QF...");

// Create from public key
const addr = ErgoAddress.fromPublicKey(publicKeyHex);

// Get address type
addr.getType();  // "P2PK" | "P2SH" | "P2S"

// Get network
addr.network;    // "mainnet" | "testnet"

// Get ErgoTree
addr.ergoTree;   // Hex string

// Validate address
ErgoAddress.validate("9f4QF...");  // boolean
```

---

## Signing

### With EIP-12 Wallet (Nautilus)

```typescript
// Request wallet access
await ergoConnector.nautilus.connect();

// Sign transaction
const signedTx = await ergo.signTx(unsignedTx);

// Submit transaction
const txId = await ergo.submitTx(signedTx);
```

### With Secret Key (Backend)

```typescript
import { SecretKey, Prover } from "@fleet-sdk/wallet";

const secretKey = SecretKey.fromHex(privateKeyHex);
const prover = new Prover(secretKey);
const signedTx = prover.sign(unsignedTx);
```

---

## Common Patterns

### Send ERG

```typescript
new TransactionBuilder(height)
  .from(inputs)
  .to(new OutputBuilder("5000000000", recipient))  // 5 ERG
  .sendChangeTo(sender)
  .payFee("1100000")
  .build();
```

### Multi-Output Transaction

```typescript
new TransactionBuilder(height)
  .from(inputs)
  .to([
    new OutputBuilder("1000000000", recipient1),
    new OutputBuilder("2000000000", recipient2),
    new OutputBuilder("3000000000", recipient3)
  ])
  .sendChangeTo(sender)
  .payFee()
  .build();
```

### With Data Input (Oracle)

```typescript
new TransactionBuilder(height)
  .from(inputs)
  .withDataFrom(oracleBox)  // Reference without spending
  .to(output)
  .sendChangeTo(sender)
  .payFee()
  .build();
```

### Consolidate Boxes

```typescript
// Merge many small boxes into one
const totalErg = boxes.reduce((sum, b) => sum + BigInt(b.value), 0n);
const fee = 1100000n;

new TransactionBuilder(height)
  .from(boxes)
  .to(new OutputBuilder((totalErg - fee).toString(), address))
  .payFee(fee.toString())
  .build();
```

---

## Constants

```typescript
// Minimum box value
const SAFE_MIN_BOX_VALUE = 1000000n;  // 0.001 ERG

// Minimum fee
const MIN_FEE = 1100000n;  // 0.0011 ERG

// ERG decimals
const ERG_DECIMALS = 9;

// Convert ERG to nanoERG
const nanoErgs = ergAmount * 1000000000n;
```

---

## Type Imports

```typescript
// Core types
import {
  TransactionBuilder,
  OutputBuilder,
  BoxSelector,
  ErgoAddress,
  type Box,
  type SignedTransaction,
  type UnsignedTransaction
} from "@fleet-sdk/core";

// Serialization
import { SInt, SLong, SColl, SByte } from "@fleet-sdk/core";

// Wallet operations
import { SecretKey, Prover } from "@fleet-sdk/wallet";

// Compiler
import { compile } from "@fleet-sdk/compiler";

// Mock chain (testing)
import { MockChain } from "@fleet-sdk/mock-chain";
```

---

## Quick Reference Table

| Operation | Code |
|-----------|------|
| **Send ERG** | `new OutputBuilder(amount, address)` |
| **Add token** | `.addTokens({ tokenId, amount })` |
| **Mint token** | `.mintToken({ name, amount, ... })` |
| **Burn token** | `.burnTokens({ tokenId, amount })` |
| **Set register** | `.setAdditionalRegisters({ R4: value })` |
| **Data input** | `.withDataFrom(box)` |
| **Pay fee** | `.payFee("1100000")` |
| **Build tx** | `.build()` |

---

## Useful Links

- [Fleet SDK Docs](https://fleet-sdk.github.io/docs/)
- [EIP-12 Wallet Standard](https://github.com/ergoplatform/eips/blob/master/eip-0012.md)
- [ErgoScript Reference](https://docs.ergoplatform.com/dev/scs/ergoscript/)
- [Ergo Explorer](https://explorer.ergoplatform.com/)
- [Testnet Faucet](https://testnet.ergofaucet.org/)

---

<div style="text-align: center; padding: 20px;">
  <strong>🚀 Fleet SDK - Build on Ergo with confidence!</strong>
</div>
