# 🔒 Time-Lock Contract Example

> Lock ERG or tokens until a specific date/time

This example demonstrates a **single-interaction transaction** pattern where funds are locked until a specific timestamp.

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    TIME-LOCK FLOW                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   DEPOSIT PHASE                 WITHDRAWAL PHASE                │
│   ┌─────────────┐               ┌─────────────┐                │
│   │   User      │               │   User      │                │
│   │   Wallet    │               │   Wallet    │                │
│   └──────┬──────┘               └──────▲──────┘                │
│          │                             │                        │
│          │ Lock funds                  │ Unlock after date      │
│          ▼                             │                        │
│   ┌─────────────┐               ┌──────┴──────┐                │
│   │  TimeLock   │   TIME PASSES │  TimeLock   │                │
│   │   Box       │ ────────────▶ │   Box       │                │
│   │ 🔒 LOCKED   │               │ 🔓 UNLOCKED │                │
│   └─────────────┘               └─────────────┘                │
│                                                                 │
│   Before: unlockTime            After: unlockTime               │
│   ❌ Cannot withdraw            ✅ Can withdraw                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## The Smart Contract

```scala
{
  // Time-Lock Contract
  // Funds can only be spent after unlockTime by the owner
  
  // Constants (injected at compile time)
  val unlockTime: Long = $unlockTime
  val ownerPk: GroupElement = $ownerPk
  
  // Conditions
  val timeCondition = CONTEXT.preHeader.timestamp >= unlockTime
  val ownerCondition = proveDlog(ownerPk)
  
  // Both must be satisfied
  sigmaProp(timeCondition) && ownerCondition
}
```

## Complete Implementation

```typescript
import { 
  TransactionBuilder, 
  OutputBuilder,
  ErgoAddress,
  SAFE_MIN_BOX_VALUE,
  type Box
} from "@fleet-sdk/core";
import { compile } from "@fleet-sdk/compiler";

// ════════════════════════════════════════
// 📝 TIME-LOCK CONTRACT
// ════════════════════════════════════════

const TIME_LOCK_CONTRACT = `
{
  // Time-Lock Contract v1.0
  // Funds locked until specific timestamp
  
  val unlockTime = $unlockTime
  val ownerPk = $ownerPk
  
  // Can only spend after unlock time
  val isUnlocked = CONTEXT.preHeader.timestamp >= unlockTime
  
  // Must be signed by owner
  val isOwner = proveDlog(ownerPk)
  
  sigmaProp(isUnlocked) && isOwner
}
`;

// ════════════════════════════════════════
// 🔧 HELPER FUNCTIONS
// ════════════════════════════════════════

interface TimeLockParams {
  ownerAddress: string;
  lockAmount: string;
  unlockDate: Date;
}

/**
 * Compile time-lock contract with specific parameters
 */
function compileTimeLockContract(
  ownerPk: string,
  unlockTimestamp: bigint
): string {
  const compiled = compile(TIME_LOCK_CONTRACT, {
    map: {
      unlockTime: unlockTimestamp,
      ownerPk: ownerPk
    }
  });
  
  return compiled.toHex();
}

/**
 * Get public key from Ergo address
 */
function getPublicKeyFromAddress(address: string): string {
  const ergoAddress = ErgoAddress.fromBase58(address);
  const publicKeys = ergoAddress.getPublicKeys();
  
  if (publicKeys.length === 0) {
    throw new Error("Address has no public key (might be P2S address)");
  }
  
  return publicKeys[0];
}

// ════════════════════════════════════════
// 🔒 LOCK FUNDS
// ════════════════════════════════════════

/**
 * Create a time-locked box
 * 
 * @param inputs - User's input boxes
 * @param params - Lock parameters
 * @param currentHeight - Current blockchain height
 * @returns Unsigned transaction
 */
async function createTimeLockBox(
  inputs: Box<string>[],
  params: TimeLockParams,
  currentHeight: number
) {
  const { ownerAddress, lockAmount, unlockDate } = params;
  
  // 1. Get owner's public key
  const ownerPk = getPublicKeyFromAddress(ownerAddress);
  
  // 2. Convert date to timestamp
  const unlockTimestamp = BigInt(unlockDate.getTime());
  
  // 3. Compile contract
  const ergoTree = compileTimeLockContract(ownerPk, unlockTimestamp);
  
  // 4. Get contract address
  const contractAddress = ErgoAddress.fromErgoTree(ergoTree).toString();
  
  console.log("═══════════════════════════════════════════");
  console.log("🔒 Creating Time-Lock Box");
  console.log("═══════════════════════════════════════════");
  console.log(`Owner: ${ownerAddress}`);
  console.log(`Amount: ${BigInt(lockAmount) / 1000000000n} ERG`);
  console.log(`Unlock Date: ${unlockDate.toISOString()}`);
  console.log(`Contract: ${contractAddress}`);
  console.log("═══════════════════════════════════════════");
  
  // 5. Build transaction
  const unsignedTx = new TransactionBuilder(currentHeight)
    .from(inputs)
    .to(
      new OutputBuilder(lockAmount, contractAddress)
        .setAdditionalRegisters({
          // Store unlock time in R4 for easy reading
          R4: unlockTimestamp.toString(),
          // Store owner address in R5 for reference
          R5: ownerAddress
        })
    )
    .sendChangeTo(ownerAddress)
    .payFee("1100000")
    .build();

  return {
    transaction: unsignedTx,
    contractAddress,
    unlockTimestamp
  };
}

// ════════════════════════════════════════
// 🔓 UNLOCK FUNDS
// ════════════════════════════════════════

/**
 * Withdraw from time-lock box (after unlock time)
 */
async function withdrawFromTimeLock(
  timeLockBox: Box<string>,
  ownerAddress: string,
  currentHeight: number,
  currentTimestamp: number
) {
  // 1. Check if unlocked
  const unlockTime = BigInt(timeLockBox.additionalRegisters.R4 || "0");
  
  if (BigInt(currentTimestamp) < unlockTime) {
    const unlockDate = new Date(Number(unlockTime));
    throw new Error(
      `Box is still locked! Unlocks at: ${unlockDate.toISOString()}`
    );
  }
  
  console.log("═══════════════════════════════════════════");
  console.log("🔓 Withdrawing from Time-Lock");
  console.log("═══════════════════════════════════════════");
  console.log(`Box ID: ${timeLockBox.boxId}`);
  console.log(`Amount: ${BigInt(timeLockBox.value) / 1000000000n} ERG`);
  console.log(`To: ${ownerAddress}`);
  console.log("═══════════════════════════════════════════");
  
  // 2. Build withdrawal transaction
  const withdrawAmount = BigInt(timeLockBox.value) - BigInt("1100000");
  
  const unsignedTx = new TransactionBuilder(currentHeight)
    .from([timeLockBox])
    .to(
      new OutputBuilder(withdrawAmount.toString(), ownerAddress)
    )
    .payFee("1100000")
    .build();

  return unsignedTx;
}

// ════════════════════════════════════════
// 📋 USAGE EXAMPLE
// ════════════════════════════════════════

async function main() {
  // User's address
  const ownerAddress = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8y";
  
  // Mock input box (in real app, fetch from blockchain)
  const userInputBox: Box<string> = {
    boxId: "abc123def456...",
    value: "10000000000", // 10 ERG
    ergoTree: "0008cd...",
    creationHeight: 1000000,
    assets: [],
    additionalRegisters: {},
    transactionId: "tx123...",
    index: 0
  };

  // Lock until New Year 2026
  const unlockDate = new Date("2026-01-01T00:00:00Z");
  
  // Create time-lock box
  const { transaction, contractAddress } = await createTimeLockBox(
    [userInputBox],
    {
      ownerAddress,
      lockAmount: "5000000000", // Lock 5 ERG
      unlockDate
    },
    1100000
  );

  console.log("\n📦 Transaction created!");
  console.log(`Outputs: ${transaction.outputs.length}`);
  console.log(`Contract address: ${contractAddress}`);
  
  // After signing and submitting...
  // Later, when time passes:
  
  // const timeLockBox = await fetchBox(contractAddress);
  // const withdrawTx = await withdrawFromTimeLock(
  //   timeLockBox,
  //   ownerAddress,
  //   currentHeight,
  //   Date.now()
  // );
}

// ════════════════════════════════════════
// 🧪 TESTS
// ════════════════════════════════════════

import { describe, it, expect } from "vitest";

describe("Time-Lock Contract", () => {
  const mockAddress = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8y";
  
  it("should compile time-lock contract", () => {
    const mockPk = "0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798";
    const unlockTime = BigInt(Date.now() + 86400000); // 1 day from now
    
    const ergoTree = compileTimeLockContract(mockPk, unlockTime);
    
    expect(ergoTree).toBeTruthy();
    expect(ergoTree.length).toBeGreaterThan(0);
  });

  it("should reject withdrawal before unlock time", async () => {
    const timeLockBox: Box<string> = {
      boxId: "test123",
      value: "1000000000",
      ergoTree: "0008cd...",
      creationHeight: 100000,
      assets: [],
      additionalRegisters: {
        R4: (Date.now() + 86400000).toString() // Locked for 1 more day
      },
      transactionId: "tx123",
      index: 0
    };

    await expect(
      withdrawFromTimeLock(timeLockBox, mockAddress, 110000, Date.now())
    ).rejects.toThrow("Box is still locked");
  });

  it("should allow withdrawal after unlock time", async () => {
    const pastTime = Date.now() - 86400000; // 1 day ago
    
    const timeLockBox: Box<string> = {
      boxId: "test123",
      value: "1000000000",
      ergoTree: "0008cd...",
      creationHeight: 100000,
      assets: [],
      additionalRegisters: {
        R4: pastTime.toString() // Already unlocked
      },
      transactionId: "tx123",
      index: 0
    };

    const tx = await withdrawFromTimeLock(
      timeLockBox, 
      mockAddress, 
      110000, 
      Date.now()
    );
    
    expect(tx).toBeTruthy();
    expect(tx.outputs.length).toBe(1);
  });
});

export {
  createTimeLockBox,
  withdrawFromTimeLock,
  compileTimeLockContract,
  TIME_LOCK_CONTRACT
};
```

## Use Cases

| Use Case | Description |
|----------|-------------|
| **Vesting** | Release employee tokens over time |
| **Savings** | Lock funds to prevent impulse spending |
| **Escrow** | Release funds after delivery date |
| **ICO** | Lock team tokens for specified period |
| **Inheritance** | Release to heirs after certain date |

## Try It Yourself

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/fleet-sdk-timelock)

## Next Steps

- [More Examples](./index) - Browse all code examples
- [Data Inputs](../concepts/data-inputs) - Reference external boxes
- [ErgoPay Integration](../concepts/reduced-tx-ergopay) - Mobile signing
