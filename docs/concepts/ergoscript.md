# 📜 ErgoScript Basics

> Writing spending conditions for Ergo smart contracts

## What is ErgoScript?

ErgoScript is Ergo's smart contract language. It's:
- **Declarative** - Describes conditions, not procedures
- **Functional** - No side effects, pure expressions
- **Sigma Protocol based** - Cryptographic proof system

## The Key Insight

ErgoScript answers one question:

> **"Can this box be spent in this transaction?"**

It returns `true` (can spend) or `false` (cannot spend).

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ErgoScript evaluates to sigmaProp (boolean-like)     │
│                                                         │
│   sigmaProp(true)  → ✅ Box can be spent               │
│   sigmaProp(false) → ❌ Box cannot be spent            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Basic Syntax

### Hello World Contract

```scala
{
  sigmaProp(true)
}
```

This box can be spent by anyone (always returns true).

### Owner Only

```scala
{
  val ownerPk = PK("9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v")
  sigmaProp(ownerPk)
}
```

Only the owner with the matching private key can spend.

### Time Lock

```scala
{
  val unlockHeight = 1500000L
  sigmaProp(HEIGHT >= unlockHeight)
}
```

Anyone can spend, but only after block 1,500,000.

## Context Variables

ErgoScript has access to transaction context:

| Variable | Type | Description |
|----------|------|-------------|
| `HEIGHT` | Int | Current blockchain height |
| `SELF` | Box | The box being spent |
| `INPUTS` | Coll[Box] | All input boxes |
| `OUTPUTS` | Coll[Box] | All output boxes |
| `CONTEXT` | Context | Full transaction context |

### Examples

```scala
// Check current height
sigmaProp(HEIGHT > 1000000)

// Access the box being spent
val myValue = SELF.value

// Check first output
val firstOutput = OUTPUTS(0)
sigmaProp(firstOutput.value >= 1000000L)

// Count inputs
sigmaProp(INPUTS.size == 2)
```

## Box Properties in Scripts

```scala
{
  // Value (ERG amount in nanoERG)
  val boxValue = SELF.value
  
  // Tokens in this box
  val tokens = SELF.tokens
  val firstToken = SELF.tokens(0)
  val tokenId = firstToken._1
  val tokenAmount = firstToken._2
  
  // Registers
  val r4Data = SELF.R4[Coll[Byte]].get
  val r5Number = SELF.R5[Long].get
  
  // Script hash
  val scriptBytes = SELF.propositionBytes
  
  sigmaProp(boxValue > 1000000L)
}
```

## Common Patterns

### Multi-Signature (2-of-3)

```scala
{
  val alice = PK("9fAAA...")
  val bob = PK("9fBBB...")
  val charlie = PK("9fCCC...")
  
  sigmaProp(atLeast(2, Coll(alice, bob, charlie)))
}
```

### Password Protected (Hash Lock)

```scala
{
  val secretHash = fromBase16("e3b0c44298fc1c...")
  val preimage = SELF.R4[Coll[Byte]].get
  
  sigmaProp(sha256(preimage) == secretHash)
}
```

### Threshold Payment

```scala
{
  val minPayment = 10000000000L  // 10 ERG
  val recipient = PK("9fRecipient...")
  
  val correctRecipient = OUTPUTS(0).propositionBytes == recipient.propBytes
  val sufficientAmount = OUTPUTS(0).value >= minPayment
  
  sigmaProp(correctRecipient && sufficientAmount)
}
```

### Token Gating

```scala
{
  val requiredTokenId = fromBase16("03faf2cb...")
  val requiredAmount = 100L
  
  // Check if spender has required tokens
  val hasToken = INPUTS.exists { (box: Box) =>
    box.tokens.exists { (token: (Coll[Byte], Long)) =>
      token._1 == requiredTokenId && token._2 >= requiredAmount
    }
  }
  
  sigmaProp(hasToken)
}
```

## Operators

### Boolean
```scala
&&  // AND
||  // OR
!   // NOT
```

### Comparison
```scala
==  // Equal
!=  // Not equal
>   // Greater than
>=  // Greater or equal
<   // Less than
<=  // Less or equal
```

### Arithmetic
```scala
+   // Addition
-   // Subtraction
*   // Multiplication
/   // Division
%   // Modulo
```

## Type Annotations

```scala
{
  // Explicit types help clarity
  val amount: Long = 1000000L
  val data: Coll[Byte] = SELF.R4[Coll[Byte]].get
  val pk: SigmaProp = PK("9f...")
  
  sigmaProp(pk)
}
```

## Using with Fleet SDK

```typescript
import { compile } from "@fleet-sdk/compiler";

const script = `
{
  val ownerPk = PK("9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v")
  sigmaProp(HEIGHT > 1500000L && ownerPk)
}
`;

// Compile to ErgoTree
const compiled = compile(script);

console.log(compiled.ergoTree);  // Binary representation
console.log(compiled.address);    // P2S address for deposits
```

## Best Practices

### 1. Keep It Simple
```scala
// ✅ Good: Clear and simple
sigmaProp(HEIGHT > 1000000L)

// ❌ Avoid: Overly complex in single expression
sigmaProp(HEIGHT > 1000000L && INPUTS.size > 0 && OUTPUTS.size < 5 && ...)
```

### 2. Use Named Variables
```scala
// ✅ Good: Self-documenting
{
  val unlockHeight = 1500000L
  val owner = PK("9f...")
  sigmaProp(HEIGHT >= unlockHeight && owner)
}

// ❌ Avoid: Magic numbers
sigmaProp(HEIGHT >= 1500000L && PK("9f..."))
```

### 3. Handle Edge Cases
```scala
{
  // Check if register exists before accessing
  val hasR4 = SELF.R4[Long].isDefined
  val r4Value = if (hasR4) SELF.R4[Long].get else 0L
  
  sigmaProp(r4Value > 100L)
}
```

## Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Type mismatch" | Wrong type used | Check variable types |
| "Undefined variable" | Typo or missing val | Declare with `val` |
| "sigmaProp expected" | Missing wrapper | Wrap with `sigmaProp()` |
| "Cannot access R4" | Register not set | Use `.isDefined` check |

## Next Steps

- [Smart Contracts Tutorial →](../tutorials/04-smart-contracts.md) - Build contracts
- [Contract Examples →](../../examples/05-contract-interaction.ts) - See working code
- [Multi-Sig Guide →](../../examples/06-multi-sig-wallet.ts) - Team wallets
