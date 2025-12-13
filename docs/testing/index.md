# 🏟️ Test Arena

> Battle-test your code! Each passing test earns XP!

<div class="arena-header">

## ⚔️ Current Session Stats

```
╔═══════════════════════════════════════════════════════════╗
║  🎮 FLEET SDK TEST ARENA                                  ║
║                                                           ║
║  Tests Passed: 0 / 25        XP Earned: 0                ║
║  Current Streak: 🔥 x1       Rank: 🥉 Novice              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

</div>

---

## ⚔️ Battle Stages

### 🟢 Stage 1: Basic Combat

**Difficulty:** Easy | **XP Pool:** 60

| # | Test | Status | XP |
|:-:|------|:------:|---:|
| 1 | Transaction creation | ⬜ | +10 |
| 2 | Insufficient funds error | ⬜ | +10 |
| 3 | Minimum box value | ⬜ | +10 |
| 4 | Multi-output transaction | ⬜ | +15 |
| 5 | Fee calculation | ⬜ | +15 |

```bash
# ⚔️ FIGHT!
pnpm test tests/basic-transfer.test.ts
```

**Victory Reward:** 🏅 "Transaction Initiate" Badge

---

### 🟡 Stage 2: Token Warfare

**Difficulty:** Medium | **XP Pool:** 135

| # | Test | Status | XP |
|:-:|------|:------:|---:|
| 1 | Single token transfer | ⬜ | +20 |
| 2 | Token change preservation | ⬜ | +20 |
| 3 | Multiple token types | ⬜ | +25 |
| 4 | NFT creation (amount=1) | ⬜ | +30 |
| 5 | Token validation | ⬜ | +15 |
| 6 | Metadata encoding | ⬜ | +25 |

```bash
# ⚔️ FIGHT!
pnpm test tests/token-operations.test.ts
```

**Victory Reward:** 🏅 "Token Master" Badge

---

### 🟠 Stage 3: Utility Arsenal

**Difficulty:** Medium | **XP Pool:** 120

| # | Test | Status | XP |
|:-:|------|:------:|---:|
| 1 | ERG → nanoERG conversion | ⬜ | +10 |
| 2 | nanoERG → ERG conversion | ⬜ | +10 |
| 3 | Address validation (valid) | ⬜ | +15 |
| 4 | Address validation (invalid) | ⬜ | +15 |
| 5 | Token ID validation | ⬜ | +15 |
| 6 | Box value calculation | ⬜ | +20 |
| 7 | Fee estimation (simple) | ⬜ | +15 |
| 8 | Fee estimation (complex) | ⬜ | +20 |

```bash
# ⚔️ FIGHT!
pnpm test tests/utils.test.ts
```

**Victory Reward:** 🏅 "Utility Belt" Badge

---

### 🔴 Stage 4: Mock Chain Dungeon

**Difficulty:** BOSS | **XP Pool:** 205

| # | Test | Status | XP |
|:-:|------|:------:|---:|
| 1 | First-fit box selection | ⬜ | +25 |
| 2 | Largest-first selection | ⬜ | +25 |
| 3 | UTXO tracking | ⬜ | +30 |
| 4 | Double-spend prevention | ⬜ | +35 |
| 5 | Height lock condition | ⬜ | +40 |
| 6 | Combined AND conditions | ⬜ | +50 |

```bash
# ⚔️ BOSS FIGHT!
pnpm test tests/mock-chain.test.ts
```

**Victory Reward:** 🏅 "Chain Simulator" Badge + 👑 Title Upgrade

---

## 🏆 Victory Screen

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ⚔️ BATTLE COMPLETE!                                      │
│                                                             │
│   ╔═══════════════════════════════════════════════════╗    │
│   ║                                                   ║    │
│   ║   Tests Passed: ██████████ 25/25                 ║    │
│   ║   XP Earned: +520                                 ║    │
│   ║   Streak Bonus: 🔥🔥🔥 x3.0                       ║    │
│   ║   Total XP: 1,560                                 ║    │
│   ║                                                   ║    │
│   ║   🏅 NEW BADGES UNLOCKED:                        ║    │
│   ║      • Transaction Initiate                       ║    │
│   ║      • Token Master                               ║    │
│   ║      • Utility Belt                               ║    │
│   ║      • Chain Simulator                            ║    │
│   ║                                                   ║    │
│   ║   👑 RANK UP: Code Warrior → Fleet Master!       ║    │
│   ║                                                   ║    │
│   ╚═══════════════════════════════════════════════════╝    │
│                                                             │
│   [Continue] [View Stats] [Leaderboard] [Share Victory]    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 XP System

### Total XP Available: 520

| Stage | XP | Difficulty |
|-------|---:|:----------:|
| Basic Combat | 60 | 🟢 |
| Token Warfare | 135 | 🟡 |
| Utility Arsenal | 120 | 🟠 |
| Mock Chain Dungeon | 205 | 🔴 |

### Rank Progression

| Rank | XP | Title |
|:----:|---:|-------|
| 🥉 | 0 | Novice Developer |
| 🥈 | 150 | Code Warrior |
| 🥇 | 300 | Test Champion |
| 👑 | 450 | Fleet Master |
| 💎 | 520 | Legendary (100%) |

### 🔥 Streak Bonuses

| Tests | Multiplier |
|------:|:----------:|
| 3+ | x1.25 |
| 5+ | x1.5 |
| 10+ | x2.0 |
| All 25 | x3.0 |

---

## 🎮 Battle Commands

```bash
# Full Arena Mode
pnpm test

# Speedrun Mode (timed)
time pnpm test

# Spectator Mode (watch)
pnpm test:watch

# Coverage Mode (completionist)
pnpm test:coverage

# Interactive UI Mode
pnpm test:ui
```

---

## 💡 Pro Gamer Tips

1. **Read error messages** - They reveal enemy weaknesses
2. **Use BigInt** - Always add `n` suffix: `1000n`
3. **Test edge cases** - Empty arrays, zero values, limits
4. **Check types** - `number` vs `bigint` matters!
5. **Chain streak** - More passes = more XP multiplier

---

<div class="cta-box">

## ⚔️ Enter the Arena!

```bash
cd fleet-sdk-tutorial
pnpm install
pnpm quest:start
pnpm test
```

[![Battle Now](https://img.shields.io/badge/⚔️_BATTLE_NOW-ff0000?style=for-the-badge)](https://github.com/fleet-sdk/fleet-sdk-tutorial)

</div>
