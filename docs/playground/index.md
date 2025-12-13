# 🎮 Fleet SDK Arena

> Level up your blockchain skills through interactive challenges!

<div class="hero-banner">

## ⚔️ Welcome, Developer!

Your journey to becoming an **Ergo Master** begins here.

**Current Rank:** 🥉 Novice Developer  
**Total XP:** 0 / 2000  
**Quests Completed:** 0 / 8

</div>

---

## 🗺️ Quest Map

```
    🏰 MASTER CITADEL (2000 XP)
         ╱╲
        ╱  ╲
    ⚔️ ARENA ⚔️
      ╱      ╲
     ╱        ╲
🔴 LEGENDS    🔴 LEGENDS
(Oracle/DeFi)   (500 XP)
     ╲        ╱
      ╲      ╱
🟠 CHAMPIONS   🟠 CHAMPIONS
(Contracts)     (300 XP)
     ╲        ╱
      ╲      ╱
   🟡 WARRIORS 🟡
   (Tokens/NFTs)
     (200 XP)
         │
   🟢 APPRENTICE 🟢
   (Basic Txs)
     (100 XP)
         │
    🚪 START HERE
```

---

## 🎯 Choose Your Quest

### 🟢 TIER 1: Apprentice Quests (100 XP each)

<div class="quest-card tier-1">

#### ⚔️ Quest 1: First Blood 🩸
> Build your first transaction and send ERG

**Objective:** Create a valid unsigned transaction  
**Reward:** 100 XP + "Transaction Initiate" Badge  
**Time Limit:** ⏱️ 10 minutes

```typescript
// YOUR MISSION: Complete this code
import { TransactionBuilder, OutputBuilder } from "@fleet-sdk/core";

const tx = new TransactionBuilder(/* ??? */)
  .from(/* ??? */)
  .to(/* ??? */)
  .sendChangeTo(/* ??? */)
  .build();

// Expected: tx.outputs.length >= 2
```

[![Start Quest](https://img.shields.io/badge/▶️_START_QUEST-00ff00?style=for-the-badge)](https://stackblitz.com/edit/fleet-quest-1)

</div>

<div class="quest-card tier-1">

#### ⚔️ Quest 2: Multi-Strike ⚔️⚔️
> Send ERG to 3 recipients in one transaction

**Objective:** Create multi-output transaction  
**Reward:** 100 XP + "Batch Master" Badge  
**Bonus:** +50 XP if done in under 5 min

```typescript
// YOUR MISSION: Send to multiple addresses
const recipients = [
  { address: "9f...", amount: 1_000_000_000n },
  { address: "9h...", amount: 2_000_000_000n },
  { address: "9g...", amount: 500_000_000n },
];

// Create outputs for ALL recipients
// HINT: Use .map() and multiple .to() calls
```

[![Start Quest](https://img.shields.io/badge/▶️_START_QUEST-00ff00?style=for-the-badge)](https://stackblitz.com/edit/fleet-quest-2)

</div>

---

### 🟡 TIER 2: Warrior Quests (200 XP each)

<div class="quest-card tier-2">

#### 🪙 Quest 3: Token Slayer
> Transfer native Ergo tokens

**Objective:** Move 100 tokens to another address  
**Reward:** 200 XP + "Token Handler" Badge  
**Secret Challenge:** Include 2 different token types (+100 XP)

```typescript
// YOUR MISSION: Transfer tokens
const tokenOutput = new OutputBuilder(SAFE_MIN_BOX_VALUE, recipient)
  .addTokens({
    tokenId: "???",  // Find a valid token ID
    amount: 100n
  });

// HINT: Tokens need ERG as a "carrier"
```

[![Start Quest](https://img.shields.io/badge/▶️_START_QUEST-ffcc00?style=for-the-badge)](https://stackblitz.com/edit/fleet-quest-3)

</div>

<div class="quest-card tier-2">

#### 🎨 Quest 4: The Minting
> Create your first NFT

**Objective:** Mint an EIP-4 compliant NFT  
**Reward:** 200 XP + "NFT Creator" Badge  
**Achievement Unlock:** "Digital Artist"

```typescript
// YOUR MISSION: Mint an NFT with metadata
const nft = new OutputBuilder(SAFE_MIN_BOX_VALUE, address)
  .mintToken({ amount: 1n, name: "My Quest NFT" })
  .setAdditionalRegisters({
    R4: /* Name */,
    R5: /* Description */,
    R6: /* Decimals (0 for NFT) */,
    R7: /* Type bytes */,
    R8: /* Content link */,
  });
```

[![Start Quest](https://img.shields.io/badge/▶️_START_QUEST-ffcc00?style=for-the-badge)](https://stackblitz.com/edit/fleet-quest-4)

</div>

---

### 🟠 TIER 3: Champion Quests (300 XP each)

<div class="quest-card tier-3">

#### 📜 Quest 5: Contract Conjurer
> Compile and deploy an ErgoScript contract

**Objective:** Create a time-locked box  
**Reward:** 300 XP + "Script Mage" Badge  
**Boss Challenge:** Make it spendable only after block 2,000,000

```scala
// YOUR MISSION: Write this ErgoScript
{
  // Only spendable after block 2,000,000
  // AND by the owner's public key
  
  sigmaProp(???)
}
```

[![Start Quest](https://img.shields.io/badge/▶️_START_QUEST-ff8800?style=for-the-badge)](https://stackblitz.com/edit/fleet-quest-5)

</div>

<div class="quest-card tier-3">

#### 🔐 Quest 6: The Vault
> Build a 2-of-3 multi-signature wallet

**Objective:** Create a team treasury  
**Reward:** 300 XP + "Vault Keeper" Badge  
**Team Bonus:** +100 XP if you test with mock keys

```scala
{
  val alice = PK("9fAAA...")
  val bob = PK("9fBBB...")  
  val charlie = PK("9fCCC...")
  
  // YOUR MISSION: Require 2 of 3 signatures
  sigmaProp(atLeast(???, Coll(???)))
}
```

[![Start Quest](https://img.shields.io/badge/▶️_START_QUEST-ff8800?style=for-the-badge)](https://stackblitz.com/edit/fleet-quest-6)

</div>

---

### 🔴 TIER 4: Legend Quests (500 XP each)

<div class="quest-card tier-4">

#### 🔮 Quest 7: Oracle Whisperer
> Read live price data from on-chain oracles

**Objective:** Fetch ERG/USD price from oracle pool  
**Reward:** 500 XP + "Oracle Reader" Badge  
**Elite Challenge:** Build a price-triggered transaction

```typescript
// YOUR MISSION: Decode oracle data
const oracleBox = await fetchOracleBox();
const priceData = oracleBox.additionalRegisters.R4;

// Decode the price (it's encoded as a Long)
const price = ???;

console.log(`ERG/USD: $${price}`);
```

[![Start Quest](https://img.shields.io/badge/▶️_START_QUEST-ff0000?style=for-the-badge)](https://stackblitz.com/edit/fleet-quest-7)

</div>

<div class="quest-card tier-4">

#### 🐉 Quest 8: DeFi Dragon
> Execute a token swap on an AMM DEX

**Objective:** Swap ERG for tokens using constant product  
**Reward:** 500 XP + "DeFi Warrior" Badge  
**Legendary:** Calculate slippage correctly (+200 XP)

```typescript
// YOUR MISSION: Implement the swap formula
function calculateOutput(
  inputAmount: bigint,
  inputReserve: bigint,
  outputReserve: bigint,
  feePercent: bigint
): bigint {
  // x * y = k (constant product)
  // Account for trading fee
  
  return ???;
}
```

[![Start Quest](https://img.shields.io/badge/▶️_START_QUEST-ff0000?style=for-the-badge)](https://stackblitz.com/edit/fleet-quest-8)

</div>

---

## 🏆 Leaderboard

| Rank | Player | XP | Badges | Title |
|:----:|--------|---:|:------:|-------|
| 🥇 | `0x1337...` | 2,450 | 🏅🏅🏅🏅🏅 | **Ergo Legend** |
| 🥈 | `0xDEAD...` | 1,800 | 🏅🏅🏅🏅 | **Chain Master** |
| 🥉 | `0xBEEF...` | 1,200 | 🏅🏅🏅 | **Smart Contract Pro** |
| 4 | `0xCAFE...` | 900 | 🏅🏅 | **Token Warrior** |
| 5 | `YOU` | 0 | - | **Novice** |

---

## 🎖️ Achievement Badges

### Unlockable Badges

| Badge | Name | Requirement |
|:-----:|------|-------------|
| 🟢 | **First Steps** | Complete Quest 1 |
| 🔵 | **Batch Master** | Send to 5+ recipients |
| 🟡 | **Token Handler** | Transfer any token |
| 🟠 | **NFT Creator** | Mint your first NFT |
| 🔴 | **Script Mage** | Deploy a contract |
| 🟣 | **Vault Keeper** | Create multi-sig |
| ⚪ | **Oracle Reader** | Fetch oracle data |
| 🐉 | **DeFi Dragon** | Execute DEX swap |

### Secret Achievements 🔒

| Badge | Name | Hint |
|:-----:|------|------|
| 🌟 | **???** | Complete all T1 in 1 hour |
| ⚡ | **???** | No errors on first try |
| 💎 | **???** | Find the easter egg |
| 👑 | **???** | 100% test coverage |

---

## 🎮 Live Battle Arena

### ⚡ Speed Round Challenges

Race against the clock!

<div class="battle-card">

#### ⚡ Round 1 (30 seconds)

**What's the minimum box value?**

```typescript
import { SAFE_MIN_BOX_VALUE } from "@fleet-sdk/core";
console.log(SAFE_MIN_BOX_VALUE); // ???
```

<details>
<summary>🔓 Reveal Answer</summary>

```typescript
// Answer: 1_000_000n (0.001 ERG)
```
+10 XP ✅

</details>

</div>

<div class="battle-card">

#### ⚡ Round 2 (60 seconds)

**Fix this broken transaction:**

```typescript
const tx = new TransactionBuilder(1_000_000)
  .from(inputs)
  .to(new OutputBuilder(100n, address))  // ❌ BUG
  .sendChangeTo(changeAddress)
  .build();
```

<details>
<summary>🔓 Reveal Answer</summary>

```typescript
// BUG: 100n < SAFE_MIN_BOX_VALUE
.to(new OutputBuilder(SAFE_MIN_BOX_VALUE, address))
```
+20 XP ✅

</details>

</div>

<div class="battle-card">

#### ⚡ Round 3 (90 seconds)

**Write ErgoScript: "anyone can spend after block 1.5M"**

<details>
<summary>🔓 Reveal Answer</summary>

```scala
{ sigmaProp(HEIGHT > 1500000L) }
```
+30 XP ✅

</details>

</div>

---

## 🎯 Daily Challenges

| Day | Challenge | Bonus XP |
|-----|-----------|----------|
| MON | Transaction Speed Run | +50 |
| TUE | Token Collector | +75 |
| WED | Contract Deploy | +100 |
| THU | Multi-Sig Mystery | +100 |
| FRI | DeFi Duel | +150 |
| SAT | Free Build | +200 |
| SUN | Boss Battle | +500 |

---

## 🚀 Quick Start

```bash
# Clone the arena
git clone https://github.com/fleet-sdk/fleet-sdk-tutorial.git
cd fleet-sdk-tutorial

# Install weapons
pnpm install

# Enter the arena!
pnpm quest:start

# Battle!
pnpm test
```

---

<div class="cta-box">

## 🎮 Ready Player One?

[![Enter Arena](https://img.shields.io/badge/🎮_ENTER_ARENA-blueviolet?style=for-the-badge)](https://stackblitz.com/github/fleet-sdk/fleet-sdk-tutorial)

[![Run Tests](https://img.shields.io/badge/⚔️_BATTLE-success?style=for-the-badge)](https://github.com/fleet-sdk/fleet-sdk-tutorial)

[![Leaderboard](https://img.shields.io/badge/🏆_RANKS-gold?style=for-the-badge)](https://github.com/fleet-sdk/fleet-sdk-tutorial/discussions)

</div>
