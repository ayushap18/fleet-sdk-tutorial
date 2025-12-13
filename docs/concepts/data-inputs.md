# 🔄 Data Inputs

> Understanding Data Inputs in Ergo Transactions

Data inputs are a powerful feature unique to Ergo's eUTXO model. They allow transactions to **reference boxes without spending them**.

## What are Data Inputs?

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSACTION STRUCTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   INPUTS (spent)              DATA INPUTS (read-only)           │
│   ┌─────────────┐             ┌─────────────┐                   │
│   │   Box A     │──────┐      │   Box X     │ ← Referenced      │
│   │   (consumed)│      │      │   (preserved)│   but NOT spent  │
│   └─────────────┘      │      └─────────────┘                   │
│                        │                                        │
│   ┌─────────────┐      │      ┌─────────────┐                   │
│   │   Box B     │──────┼─────▶│   OUTPUTS   │                   │
│   │   (consumed)│      │      │   (created) │                   │
│   └─────────────┘      │      └─────────────┘                   │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
              Inputs are destroyed
              Data inputs remain on chain!
```

## Why Use Data Inputs?

| Benefit | Description |
|---------|-------------|
| **No Spending** | Reference box data without consuming it |
| **No Signatures** | Don't need to prove ownership |
| **Shared State** | Multiple transactions can read same box |
| **Oracle Data** | Read price feeds without spending oracle box |
| **Cheaper** | Often reduces transaction complexity |

## Code Example: Using Data Inputs

```typescript
import { 
  TransactionBuilder, 
  OutputBuilder,
  SAFE_MIN_BOX_VALUE,
  type Box 
} from "@fleet-sdk/core";

// Example: Reading oracle price data
async function createTransactionWithDataInput() {
  // The oracle box we want to READ (not spend)
  const oracleBox: Box<string> = {
    boxId: "oracle_box_id_here",
    value: "1000000",
    ergoTree: "0008cd...", // Oracle's ErgoTree
    creationHeight: 1000000,
    assets: [],
    additionalRegisters: {
      R4: "0580c8afa025", // Price data: 100000000 (1 ERG = $1.00)
    },
    transactionId: "abc123...",
    index: 0,
  };

  // Your input boxes (these WILL be spent)
  const myInputBoxes: Box<string>[] = [
    {
      boxId: "my_box_id",
      value: "5000000000", // 5 ERG
      ergoTree: "0008cd...",
      creationHeight: 999999,
      assets: [],
      additionalRegisters: {},
      transactionId: "def456...",
      index: 0,
    }
  ];

  const currentHeight = 1100000;
  const myAddress = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8y";

  // Build transaction with data input
  const unsignedTx = new TransactionBuilder(currentHeight)
    .from(myInputBoxes)           // Inputs that WILL be spent
    .withDataFrom([oracleBox])    // Data inputs (READ-ONLY)
    .to(
      new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        myAddress
      )
    )
    .sendChangeTo(myAddress)
    .payFee("1100000")
    .build();

  console.log("Transaction built with data input!");
  console.log("Data inputs:", unsignedTx.dataInputs.length);
  
  return unsignedTx;
}
```

## Real-World Use Case: Oracle Price Feed

```typescript
import { 
  TransactionBuilder, 
  OutputBuilder,
  SConstant,
  SLong
} from "@fleet-sdk/core";

/**
 * Example: DeFi swap that uses oracle price
 * The oracle box provides the exchange rate
 */
async function swapWithOraclePrice(
  userBoxes: Box<string>[],
  oracleBox: Box<string>,
  swapAmount: bigint,
  userAddress: string
) {
  // Read price from oracle's R4 register
  const priceData = oracleBox.additionalRegisters.R4;
  
  // Decode the price (assuming it's stored as SLong)
  // In real code, use proper Sigma decoding
  console.log("Oracle price data:", priceData);
  
  const currentHeight = 1100000;
  
  const tx = new TransactionBuilder(currentHeight)
    .from(userBoxes)
    .withDataFrom([oracleBox])  // Oracle as data input
    .to(
      new OutputBuilder(swapAmount.toString(), userAddress)
    )
    .sendChangeTo(userAddress)
    .payFee("1100000")
    .build();

  return tx;
}
```

## Data Input vs Regular Input

```typescript
// ❌ WRONG: Using oracle as regular input (spends it!)
const wrongTx = new TransactionBuilder(height)
  .from([...userBoxes, oracleBox])  // Oracle will be DESTROYED
  .build();

// ✅ CORRECT: Using oracle as data input (preserves it)
const correctTx = new TransactionBuilder(height)
  .from(userBoxes)
  .withDataFrom([oracleBox])  // Oracle is only READ
  .build();
```

## Accessing Data Inputs in ErgoScript

In your smart contracts, data inputs are accessed via `CONTEXT.dataInputs`:

```scala
{
  // Access first data input
  val oracleBox = CONTEXT.dataInputs(0)
  
  // Read oracle price from R4
  val oraclePrice = oracleBox.R4[Long].get
  
  // Use price in validation logic
  val minOutput = SELF.value * oraclePrice / 1000000
  
  OUTPUTS(0).value >= minOutput
}
```

## Multiple Data Inputs

```typescript
// Using multiple data inputs
const tx = new TransactionBuilder(height)
  .from(inputs)
  .withDataFrom([
    oracleBox,      // CONTEXT.dataInputs(0)
    configBox,      // CONTEXT.dataInputs(1)
    governanceBox   // CONTEXT.dataInputs(2)
  ])
  .to(output)
  .sendChangeTo(changeAddress)
  .build();
```

## Pros and Cons

### ✅ Advantages

1. **Concurrent Access** - Multiple transactions can read the same box simultaneously
2. **No Ownership Required** - Anyone can reference any box as data input
3. **Preserves State** - Box remains on chain after transaction
4. **Gas Efficient** - Often cheaper than alternatives
5. **Perfect for Oracles** - Read price feeds without spending

### ⚠️ Limitations

1. **Read-Only** - Cannot modify the box
2. **Must Exist** - Box must be unspent when transaction executes
3. **Race Conditions** - Box might be spent between building and submitting
4. **No Tokens** - Cannot extract tokens from data inputs

## Best Practices

```typescript
// 1. Always verify data input still exists before submitting
async function verifyDataInputExists(boxId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.ergoplatform.com/api/v1/boxes/${boxId}`
    );
    const box = await response.json();
    return !box.spentTransactionId; // Not spent = still exists
  } catch {
    return false;
  }
}

// 2. Build transaction only when ready to submit
async function buildAndSubmit(oracleBoxId: string) {
  // Fetch fresh oracle box right before building
  const oracleBox = await fetchBox(oracleBoxId);
  
  // Build immediately
  const tx = new TransactionBuilder(height)
    .from(inputs)
    .withDataFrom([oracleBox])
    .build();
  
  // Submit immediately
  return submitTransaction(tx);
}
```

## Test Example

```typescript
import { describe, it, expect } from "vitest";
import { TransactionBuilder, OutputBuilder, SAFE_MIN_BOX_VALUE } from "@fleet-sdk/core";

describe("Data Inputs", () => {
  it("should include data input in transaction", () => {
    const inputBox = {
      boxId: "input123",
      value: "1000000000",
      ergoTree: "0008cd...",
      creationHeight: 100000,
      assets: [],
      additionalRegisters: {},
      transactionId: "tx123",
      index: 0,
    };

    const dataInputBox = {
      boxId: "data123",
      value: "1000000",
      ergoTree: "0008cd...",
      creationHeight: 100000,
      assets: [],
      additionalRegisters: { R4: "0580c8afa025" },
      transactionId: "tx456",
      index: 0,
    };

    const tx = new TransactionBuilder(110000)
      .from([inputBox])
      .withDataFrom([dataInputBox])
      .to(new OutputBuilder(SAFE_MIN_BOX_VALUE, "9f4QF8AD..."))
      .sendChangeTo("9f4QF8AD...")
      .payFee("1100000")
      .build();

    expect(tx.dataInputs).toHaveLength(1);
    expect(tx.dataInputs[0].boxId).toBe("data123");
    expect(tx.inputs).toHaveLength(1);
    expect(tx.inputs[0].boxId).toBe("input123");
  });
});
```

## Next Steps

- [Compile Time Constants](./compile-time-constants) - Inject values at contract compile time
- [Reduced Transactions & ErgoPay](./reduced-tx-ergopay) - Mobile wallet integration
- [Smart Contracts](../tutorials/04-smart-contracts) - Write custom ErgoScript
