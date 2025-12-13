# ⚙️ Compile Time Constants

> Injecting values into ErgoScript contracts at compile time

Compile time constants allow you to **inject values into contracts when compiling**, creating customized contract instances.

## What are Compile Time Constants?

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPILE TIME CONSTANTS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ErgoScript Template          Compiled Contract                │
│   ┌─────────────────┐          ┌─────────────────┐             │
│   │ {               │          │ {               │             │
│   │   val pk = $PK  │ ──────▶  │   val pk = ...  │             │
│   │   val amt = $AMT│  inject  │   val amt = 100 │             │
│   │   ...           │  values  │   ...           │             │
│   │ }               │          │ }               │             │
│   └─────────────────┘          └─────────────────┘             │
│                                                                 │
│   Template (reusable)          Instance (specific)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Why Use Compile Time Constants?

| Use Case | Description |
|----------|-------------|
| **User-specific contracts** | Inject user's public key |
| **Configurable amounts** | Set minimum values at compile |
| **Time-locked contracts** | Inject unlock timestamps |
| **Token IDs** | Specify which tokens contract accepts |
| **Custom logic** | Create variants of same contract |

## Basic Example

```typescript
import { compile } from "@fleet-sdk/compiler";
import { Network } from "@fleet-sdk/core";

// Contract template with placeholder $ownerPk
const contractTemplate = `
{
  // Only owner can spend this box
  proveDlog($ownerPk)
}
`;

// Compile with injected value
const compiledContract = compile(contractTemplate, {
  map: {
    ownerPk: "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"
  },
  network: Network.Mainnet
});

console.log("ErgoTree:", compiledContract.toHex());
```

## Types of Constants

### 1. Public Keys (GroupElement)

```typescript
const contract = `
{
  // Spend requires signature from owner
  proveDlog($ownerPk)
}
`;

const compiled = compile(contract, {
  map: {
    ownerPk: userPublicKey  // Hex-encoded group element
  }
});
```

### 2. Numbers (Long/Int)

```typescript
const contract = `
{
  // Box must have at least minimum value
  OUTPUTS(0).value >= $minValue
}
`;

const compiled = compile(contract, {
  map: {
    minValue: 1000000000n  // 1 ERG in nanoERG
  }
});
```

### 3. Byte Arrays (Coll[Byte])

```typescript
const contract = `
{
  // Only accept specific token
  OUTPUTS(0).tokens(0)._1 == $requiredTokenId
}
`;

const compiled = compile(contract, {
  map: {
    requiredTokenId: Buffer.from(tokenId, "hex")
  }
});
```

### 4. Timestamps

```typescript
const contract = `
{
  // Time-locked: can only spend after unlock time
  CONTEXT.preHeader.timestamp >= $unlockTime
}
`;

const unlockDate = new Date("2025-06-01").getTime();

const compiled = compile(contract, {
  map: {
    unlockTime: BigInt(unlockDate)
  }
});
```

## Real-World Example: Time-Lock Contract

```typescript
import { compile } from "@fleet-sdk/compiler";
import { 
  TransactionBuilder, 
  OutputBuilder,
  Network 
} from "@fleet-sdk/core";

/**
 * Create a time-locked box that can only be spent after a certain date
 */
function createTimeLockContract(
  ownerPk: string,
  unlockTimestamp: bigint
): string {
  const contract = `
  {
    // Condition 1: Must be after unlock time
    val timeCondition = CONTEXT.preHeader.timestamp >= $unlockTime
    
    // Condition 2: Must be signed by owner
    val ownerCondition = proveDlog($ownerPk)
    
    // Both conditions must be met
    sigmaProp(timeCondition) && ownerCondition
  }
  `;

  const compiled = compile(contract, {
    map: {
      unlockTime: unlockTimestamp,
      ownerPk: ownerPk
    },
    network: Network.Mainnet
  });

  return compiled.toHex();
}

// Usage
const ownerPublicKey = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
const unlockDate = BigInt(new Date("2025-12-31").getTime());

const ergoTree = createTimeLockContract(ownerPublicKey, unlockDate);
console.log("Time-locked contract:", ergoTree);
```

## Multi-Signature Contract

```typescript
const multiSigContract = `
{
  // 2-of-3 multisig
  val pk1 = $pubKey1
  val pk2 = $pubKey2
  val pk3 = $pubKey3
  
  atLeast(2, Coll(
    proveDlog(pk1),
    proveDlog(pk2),
    proveDlog(pk3)
  ))
}
`;

const compiled = compile(multiSigContract, {
  map: {
    pubKey1: alice.publicKey,
    pubKey2: bob.publicKey,
    pubKey3: carol.publicKey
  }
});
```

## Creating Boxes with Custom Contracts

```typescript
import { 
  TransactionBuilder, 
  OutputBuilder,
  ErgoAddress 
} from "@fleet-sdk/core";
import { compile } from "@fleet-sdk/compiler";

async function createTimeLockBox(
  inputs: Box<string>[],
  ownerAddress: string,
  lockAmount: string,
  unlockTimestamp: bigint
) {
  // Get owner's public key from address
  const ownerPk = ErgoAddress.fromBase58(ownerAddress).getPublicKeys()[0];
  
  // Compile time-lock contract
  const contract = compile(`
    {
      val unlocked = CONTEXT.preHeader.timestamp >= $unlockTime
      sigmaProp(unlocked) && proveDlog($ownerPk)
    }
  `, {
    map: {
      unlockTime: unlockTimestamp,
      ownerPk: ownerPk
    }
  });

  const currentHeight = 1100000;

  // Create box with custom contract
  const tx = new TransactionBuilder(currentHeight)
    .from(inputs)
    .to(
      new OutputBuilder(
        lockAmount,
        contract.toAddress()  // Address from compiled contract
      )
    )
    .sendChangeTo(ownerAddress)
    .payFee("1100000")
    .build();

  return tx;
}
```

## Constants vs Registers

| Feature | Compile Time Constants | Registers |
|---------|----------------------|-----------|
| **When set** | At contract compile | At box creation |
| **Modifiable** | No (baked into ErgoTree) | No (but can create new box) |
| **Size** | Part of contract | Part of box |
| **Use case** | Contract configuration | Box-specific data |
| **Access** | Direct in contract | `SELF.R4`, etc. |

```typescript
// Compile time constant - same contract for all users
const contractWithConstant = `
{
  OUTPUTS(0).value >= $minAmount  // minAmount is fixed
}
`;

// Register - different value per box
const contractWithRegister = `
{
  val minAmount = SELF.R4[Long].get  // minAmount from box register
  OUTPUTS(0).value >= minAmount
}
`;
```

## Factory Pattern

Create multiple contract instances from one template:

```typescript
class ContractFactory {
  private template: string;

  constructor() {
    this.template = `
    {
      val owner = $ownerPk
      val minValue = $minValue
      
      val correctOwner = proveDlog(owner)
      val sufficientValue = OUTPUTS(0).value >= minValue
      
      correctOwner && sigmaProp(sufficientValue)
    }
    `;
  }

  createForUser(userPk: string, minValue: bigint): string {
    const compiled = compile(this.template, {
      map: {
        ownerPk: userPk,
        minValue: minValue
      }
    });
    return compiled.toHex();
  }
}

// Usage
const factory = new ContractFactory();

const aliceContract = factory.createForUser(alicePk, 1000000000n);
const bobContract = factory.createForUser(bobPk, 2000000000n);

// Different ErgoTrees, same logic!
console.log("Alice:", aliceContract);
console.log("Bob:", bobContract);
```

## Best Practices

### 1. Validate Constants Before Compiling

```typescript
function createContract(ownerPk: string, amount: bigint) {
  // Validate inputs
  if (!ownerPk || ownerPk.length !== 66) {
    throw new Error("Invalid public key");
  }
  if (amount <= 0n) {
    throw new Error("Amount must be positive");
  }

  return compile(template, {
    map: { ownerPk, amount }
  });
}
```

### 2. Use Descriptive Names

```typescript
// ✅ Good: Clear intent
const contract = `{ proveDlog($recipientPublicKey) }`;

// ❌ Bad: Unclear
const contract = `{ proveDlog($pk) }`;
```

### 3. Document Constants

```typescript
/**
 * Vesting Contract
 * 
 * Constants:
 * - $beneficiaryPk: Public key of token recipient
 * - $vestingStart: Timestamp when vesting begins
 * - $vestingPeriod: Duration in milliseconds
 * - $totalAmount: Total tokens to vest
 */
const vestingContract = `{
  // ... contract logic
}`;
```

## Test Example

```typescript
import { describe, it, expect } from "vitest";
import { compile } from "@fleet-sdk/compiler";
import { Network } from "@fleet-sdk/core";

describe("Compile Time Constants", () => {
  it("should inject public key into contract", () => {
    const contract = `{ proveDlog($ownerPk) }`;
    const publicKey = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
    
    const compiled = compile(contract, {
      map: { ownerPk: publicKey },
      network: Network.Mainnet
    });

    expect(compiled.toHex()).toBeTruthy();
    expect(compiled.toHex().length).toBeGreaterThan(0);
  });

  it("should inject numeric values", () => {
    const contract = `{ sigmaProp(OUTPUTS(0).value >= $minValue) }`;
    
    const compiled = compile(contract, {
      map: { minValue: 1000000000n },
      network: Network.Mainnet
    });

    expect(compiled.toHex()).toBeTruthy();
  });
});
```

## Next Steps

- [Data Inputs](./data-inputs) - Reference boxes without spending
- [Reduced Transactions](./reduced-tx-ergopay) - ErgoPay integration
- [Smart Contracts Tutorial](../tutorials/04-smart-contracts) - Build complete dApps
