# 📝 Registers in Ergo

> Store custom data in boxes using registers R4-R9

## Overview

Ergo boxes have **9 registers** (R0-R9):
- **R0-R3**: Reserved by protocol (value, script, tokens, creation info)
- **R4-R9**: Available for custom data storage

```
┌─────────────────────────────────────────────────────────────┐
│                    ERGO BOX REGISTERS                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   RESERVED (R0-R3)              CUSTOM (R4-R9)             │
│   ┌─────────────┐               ┌─────────────┐            │
│   │ R0: Value   │               │ R4: Custom  │ ◀─ Your   │
│   │ R1: Script  │               │ R5: Custom  │    data!  │
│   │ R2: Tokens  │               │ R6: Custom  │            │
│   │ R3: Info    │               │ R7: Custom  │            │
│   └─────────────┘               │ R8: Custom  │            │
│                                 │ R9: Custom  │            │
│                                 └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Setting Registers in Fleet SDK

```typescript
import { OutputBuilder } from "@fleet-sdk/core";
import { SInt, SLong, SColl, SByte, SBool } from "@fleet-sdk/serializer";

const output = new OutputBuilder("1000000000", address)
  .setAdditionalRegisters({
    R4: SInt(42),                           // Integer
    R5: SLong(BigInt(Date.now())),          // Long (timestamp)
    R6: SColl(SByte, [1, 2, 3, 4]),         // Byte array
    R7: SBool(true),                        // Boolean
    R8: SColl(SByte, Buffer.from("Hello")), // String as bytes
  });
```

## Type Constructors

| Type | Constructor | Example |
|------|-------------|---------|
| Integer | `SInt(n)` | `SInt(42)` |
| Long | `SLong(n)` | `SLong(1000000n)` |
| Boolean | `SBool(b)` | `SBool(true)` |
| Byte | `SByte(n)` | `SByte(255)` |
| Byte Array | `SColl(SByte, arr)` | `SColl(SByte, [1,2,3])` |
| Int Array | `SColl(SInt, arr)` | `SColl(SInt, [10,20])` |

## NFT Metadata (EIP-4)

NFTs use registers for metadata:

```typescript
const nftOutput = new OutputBuilder("1000000", address)
  .mintToken({
    amount: "1",
    name: "My NFT",
    description: "Description",
    decimals: 0
  })
  .setAdditionalRegisters({
    // R4: Name (set by mintToken)
    // R5: Description (set by mintToken)
    // R6: Decimals (set by mintToken)
    R7: SColl(SByte, Buffer.from("image/png")),     // Content type
    R8: SColl(SByte, Buffer.from("ipfs://Qm...")),  // Asset URL
    R9: SColl(SByte, Buffer.from("SHA256hash")),    // Optional: hash
  });
```

## Reading Registers

```typescript
// From a box
const box = await getBox(boxId);

// Access register data
const r4Value = box.additionalRegisters.R4;
const r5Value = box.additionalRegisters.R5;

// Registers are hex-encoded - decode as needed
console.log("R4:", r4Value);
```

## Common Use Cases

| Use Case | Registers Used |
|----------|----------------|
| **NFT Metadata** | R4-R9 (name, desc, decimals, type, URL) |
| **Oracle Data** | R4 (price), R5 (timestamp) |
| **Auction** | R4 (min bid), R5 (end time), R6 (seller) |
| **DAO Voting** | R4 (proposal ID), R5 (votes), R6 (deadline) |

## Example: Storing JSON

```typescript
const metadata = {
  name: "My Token",
  creator: "Alice",
  attributes: ["rare", "blue"]
};

const output = new OutputBuilder("1000000", address)
  .setAdditionalRegisters({
    R4: SColl(SByte, Buffer.from(JSON.stringify(metadata)))
  });
```

## Best Practices

1. **Use appropriate types** - Don't store ints as strings
2. **Keep data minimal** - Registers increase tx size
3. **Document your schema** - Others need to decode it
4. **Follow standards** - Use EIP-4 for NFTs

## Next Steps

- [Box Structure](./box-structure) - Understand full box anatomy
- [NFT Minting](/tutorials/03-nft-minting) - Create NFTs with metadata
- [Data Inputs](./data-inputs) - Reference registers from other boxes
