# 🐛 Common Issues & Solutions

> Your troubleshooting guide for Fleet SDK development

## Quick Diagnosis

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| "Insufficient funds" | Not enough ERG | Check balance, add more inputs |
| "Box value too small" | Output below minimum | Use `SAFE_MIN_BOX_VALUE` |
| "Invalid address" | Wrong network/format | Verify address format |
| "Height mismatch" | Outdated height | Fetch current height |
| "Token not found" | Wrong token ID | Verify 64-char hex ID |

---

## 💰 Transaction Issues

### Issue: "Insufficient Funds"

**Symptoms:**
```
Error: Insufficient inputs to cover outputs
```

**Cause:** Your input boxes don't have enough ERG to cover:
- Output amounts
- Network fee
- Minimum box value for change

**Solution:**

```typescript
import { RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE } from "@fleet-sdk/core";

// Calculate total required
const totalRequired = 
  outputAmount + 
  RECOMMENDED_MIN_FEE_VALUE + 
  SAFE_MIN_BOX_VALUE;  // For change box

// Verify before building
const totalInput = inputs.reduce((sum, box) => sum + box.value, 0n);
if (totalInput < totalRequired) {
  throw new Error(`Need ${totalRequired} nanoERG, have ${totalInput}`);
}
```

**Prevention:**
- Always check balance before transaction
- Include buffer for fees
- Account for change output minimum

---

### Issue: "Box Value Too Small"

**Symptoms:**
```
Error: Output box value is below minimum
```

**Cause:** Ergo boxes must contain a minimum amount of ERG (~0.001 ERG)

**Solution:**

```typescript
import { SAFE_MIN_BOX_VALUE } from "@fleet-sdk/core";

// Ensure output meets minimum
const outputValue = Math.max(yourAmount, SAFE_MIN_BOX_VALUE);

// For token-only transfers, still need ERG:
const tokenOutput = new OutputBuilder(
  SAFE_MIN_BOX_VALUE,  // Minimum ERG as "carrier"
  recipientAddress
).addTokens({ tokenId, amount: tokenAmount });
```

**Key Values:**
```typescript
SAFE_MIN_BOX_VALUE = 1_000_000n;      // 0.001 ERG (recommended)
RECOMMENDED_MIN_FEE_VALUE = 1_100_000n; // 0.0011 ERG
```

---

### Issue: "Invalid Address Format"

**Symptoms:**
```
Error: Invalid address encoding
Error: Address network mismatch
```

**Cause:** 
- Address is malformed
- Using mainnet address on testnet (or vice versa)
- Missing or extra characters

**Solution:**

```typescript
// Ergo addresses typically:
// - Start with "9" for mainnet P2PK
// - Start with "3" for P2S (script) addresses
// - Are 51-52 characters long

function validateAddress(address: string): boolean {
  // Basic format check
  if (address.length < 40 || address.length > 60) {
    return false;
  }
  
  // Check network prefix
  const validPrefixes = ["9", "3"];  // Mainnet
  // For testnet, addresses also start with "9" or "3"
  
  return validPrefixes.some(p => address.startsWith(p));
}
```

**Testnet vs Mainnet:**
- Both use similar address formats
- Test with testnet first!
- Testnet faucet: https://testnet.ergoplatform.com/en/faucet/

---

## 🪙 Token Issues

### Issue: "Token Not Found"

**Symptoms:**
```
Error: Token ID not found in inputs
Error: Cannot add non-existent token
```

**Cause:** 
- Token ID is incorrect
- Token not present in input boxes
- Typo in 64-character hex string

**Solution:**

```typescript
// Token IDs are exactly 64 hex characters
const TOKEN_ID = "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04";

// Verify token exists in inputs
function findTokenInInputs(inputs: Box[], tokenId: string): bigint {
  let total = 0n;
  for (const box of inputs) {
    const token = box.assets.find(a => a.tokenId === tokenId);
    if (token) {
      total += token.amount;
    }
  }
  return total;
}

// Check before transfer
const available = findTokenInInputs(inputs, TOKEN_ID);
if (available < amountToSend) {
  throw new Error(`Token balance: ${available}, need: ${amountToSend}`);
}
```

---

### Issue: "Token Amount Mismatch"

**Symptoms:**
```
Error: Token output amount exceeds input
```

**Cause:** Trying to send more tokens than available in inputs

**Solution:**

```typescript
// Calculate available tokens
const inputTokens = inputs
  .flatMap(box => box.assets)
  .filter(asset => asset.tokenId === targetTokenId)
  .reduce((sum, asset) => sum + asset.amount, 0n);

// Ensure you're not creating tokens out of thin air
if (outputTokenAmount > inputTokens) {
  throw new Error("Cannot send more tokens than you have");
}

// Remaining tokens go to change automatically
// Fleet SDK handles this when you use sendChangeTo()
```

---

## 📜 Contract Issues

### Issue: "Compilation Error"

**Symptoms:**
```
Error: ErgoScript compilation failed
Error: Syntax error at position X
```

**Cause:** Invalid ErgoScript syntax

**Common Mistakes:**

```typescript
// ❌ WRONG: Missing val keyword
height > 1000000

// ✅ CORRECT: Use sigmaProp wrapper
sigmaProp(HEIGHT > 1000000L)

// ❌ WRONG: Using = instead of ==
val condition = x = 5

// ✅ CORRECT: Use == for comparison
val condition = x == 5

// ❌ WRONG: Lowercase height
sigmaProp(height > 1000)

// ✅ CORRECT: HEIGHT is uppercase
sigmaProp(HEIGHT > 1000L)

// ❌ WRONG: Missing L suffix for Long
val amount = 1000000000

// ✅ CORRECT: Add L for Long literals
val amount = 1000000000L
```

---

### Issue: "Cannot Spend from Contract"

**Symptoms:**
```
Error: Script validation failed
Error: Spending conditions not met
```

**Cause:** Contract conditions not satisfied

**Debugging Steps:**

```typescript
// 1. Check HEIGHT condition
console.log(`Current height: ${currentHeight}`);
console.log(`Required height: ${contractUnlockHeight}`);
if (currentHeight < contractUnlockHeight) {
  console.log("❌ HEIGHT condition not met");
}

// 2. Check signature requirements
// Ensure you're signing with the correct key

// 3. Check OUTPUTS conditions
// Contract might require specific output structure

// 4. Use mock-chain for testing
import { MockChain } from "@fleet-sdk/mock-chain";

const chain = new MockChain();
// Test contract spending locally before mainnet
```

---

## 🔧 Setup Issues

### Issue: "Module Not Found"

**Symptoms:**
```
Error: Cannot find module '@fleet-sdk/core'
```

**Solution:**

```bash
# Make sure packages are installed
npm install @fleet-sdk/core @fleet-sdk/wallet

# If using pnpm
pnpm add @fleet-sdk/core @fleet-sdk/wallet

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: "TypeScript Errors"

**Symptoms:**
```
Error: Type 'bigint' is not assignable to type 'number'
```

**Solution:**

```typescript
// Fleet SDK uses BigInt for amounts
// Make sure to use n suffix for literals
const amount = 1_000_000_000n;  // ✅ BigInt

// Convert if needed
const amountNumber = Number(amount);  // For display
const amountBigInt = BigInt(numberValue);  // For transactions

// In tsconfig.json, ensure:
{
  "compilerOptions": {
    "target": "ES2020",  // or higher for BigInt support
    "lib": ["ES2020"]
  }
}
```

---

## 🌐 Network Issues

### Issue: "Connection Failed"

**Symptoms:**
```
Error: Failed to fetch from node
Error: Network timeout
```

**Solution:**

```typescript
// Use multiple providers as fallback
const ENDPOINTS = [
  "https://api.ergoplatform.com",
  "https://ergo-explorer.anetabtc.io",
  // Add backup endpoints
];

async function fetchWithFallback(path: string) {
  for (const endpoint of ENDPOINTS) {
    try {
      const response = await fetch(`${endpoint}${path}`);
      if (response.ok) return response;
    } catch (e) {
      console.log(`Endpoint ${endpoint} failed, trying next...`);
    }
  }
  throw new Error("All endpoints failed");
}
```

---

### Issue: "Transaction Rejected"

**Symptoms:**
```
Error: Transaction rejected by mempool
Error: Double spending detected
```

**Cause:**
- Input box already spent
- Invalid transaction format
- Fee too low

**Solution:**

```typescript
// 1. Refresh input boxes before building tx
const freshInputs = await fetchCurrentBoxes(address);

// 2. Use adequate fee
import { RECOMMENDED_MIN_FEE_VALUE } from "@fleet-sdk/core";

// 3. Check box is unspent
async function isBoxUnspent(boxId: string): Promise<boolean> {
  const response = await fetch(`/api/boxes/${boxId}`);
  const box = await response.json();
  return !box.spentTransactionId;
}
```

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```typescript
// Add logging to understand transaction flow
function logTransaction(tx: any) {
  console.log("📦 Transaction Summary:");
  console.log(`   Inputs: ${tx.inputs.length}`);
  console.log(`   Outputs: ${tx.outputs.length}`);
  
  let totalIn = 0n;
  tx.inputs.forEach((input: any, i: number) => {
    console.log(`   Input[${i}]: ${input.boxId.slice(0, 16)}...`);
    // Fetch box value if needed
  });
  
  tx.outputs.forEach((output: any, i: number) => {
    console.log(`   Output[${i}]: ${output.value} nanoERG`);
    if (output.assets?.length > 0) {
      console.log(`      Tokens: ${output.assets.length}`);
    }
  });
}
```

### Test with Mock Chain

```typescript
import { MockChain, mockUtxo } from "@fleet-sdk/mock-chain";

// Create test environment
const chain = new MockChain();

// Create mock boxes
const testBox = mockUtxo({
  value: 10_000_000_000n,
  address: "9f...",
});

// Test your transaction logic locally
```

---

## 📚 Getting Help

### Resources

1. **Fleet SDK Documentation**
   - https://fleet-sdk.github.io/docs/

2. **Ergo Platform Docs**
   - https://docs.ergoplatform.com/

3. **Discord Community**
   - https://discord.gg/ergo-platform
   - Channels: #development, #fleet-sdk

4. **GitHub Issues**
   - https://github.com/fleet-sdk/fleet/issues

### When Asking for Help

Include:
- ✅ Error message (full text)
- ✅ Code snippet (minimal reproduction)
- ✅ Fleet SDK version
- ✅ What you expected vs what happened
- ✅ Steps you've already tried

---

## 🎯 Prevention Checklist

Before submitting any transaction:

- [ ] Verified sufficient ERG balance
- [ ] Checked token balances
- [ ] Validated all addresses
- [ ] Used current blockchain height
- [ ] Tested on testnet first
- [ ] Included adequate fee
- [ ] Handled all edge cases
- [ ] Added error handling

---

> 💡 **Pro Tip:** Always test on testnet first! Get free testnet ERG from the [faucet](https://testnet.ergoplatform.com/en/faucet/).
