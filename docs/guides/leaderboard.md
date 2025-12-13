# 🏆 XP & Achievements System

Track your learning progress with our gamified XP and achievements system! Earn points, unlock badges, and see how you rank.

## Overview

The leaderboard system provides:
- **XP Tracking** - Earn points for completing tutorials and challenges
- **Achievements** - 8 unique badges to unlock
- **Progress Visualization** - See your learning journey
- **Leaderboard** - Compare with other developers

## Quick Commands

```bash
# View your current XP and rank
npm run progress

# View all achievements (locked & unlocked)
npm run achievements

# View the global leaderboard
npm run quest:leaderboard
```

## XP System

### How to Earn XP

| Activity | XP Reward |
|----------|-----------|
| Complete a tutorial | 100-500 XP |
| Pass a test suite | 50 XP per test |
| Build a working example | 75 XP |
| Complete playground quest | 100-200 XP |
| Unlock achievement | Bonus 50-200 XP |

### Rank Progression

| Rank | XP Required | Title |
|------|-------------|-------|
| 🥉 | 0 | Novice Developer |
| 🥈 | 500 | Apprentice Builder |
| 🥇 | 1,000 | Transaction Crafter |
| 💎 | 2,000 | Token Master |
| 👑 | 5,000 | Contract Wizard |
| 🏆 | 10,000 | Ergo Legend |

## Achievements

### 🎯 Available Achievements

<div class="achievements-grid">

#### 🚀 First Transaction
> Build your first valid transaction

**Requirement:** Complete Tutorial 1  
**Reward:** 100 XP + Badge

---

#### 🪙 Token Handler
> Successfully transfer tokens

**Requirement:** Complete Tutorial 2  
**Reward:** 150 XP + Badge

---

#### 🎨 NFT Creator  
> Mint your first NFT

**Requirement:** Complete Tutorial 3  
**Reward:** 200 XP + Badge

---

#### 📜 Contract Interactor
> Interact with a smart contract

**Requirement:** Complete Tutorial 4  
**Reward:** 250 XP + Badge

---

#### 🧪 Test Master
> Pass all 86 tests

**Requirement:** Run `npm test` with 100% pass rate  
**Reward:** 500 XP + Badge

---

#### 🌐 Testnet Explorer
> Connect to Ergo testnet

**Requirement:** Successfully fetch UTXOs from testnet  
**Reward:** 150 XP + Badge

---

#### 🎮 Playground Champion
> Complete all playground quests

**Requirement:** Finish all 8 arena quests  
**Reward:** 300 XP + Badge

---

#### 👑 Ergo Master
> Complete everything!

**Requirement:** All tutorials + all tests + all quests  
**Reward:** 1000 XP + Badge

</div>

## Using the API

### Check XP Progress

```typescript
import { Leaderboard } from "../src/leaderboard";

const leaderboard = new Leaderboard();
const username = "developer123";

// Get user progress
const progress = leaderboard.getProgress(username);

console.log(`XP: ${progress.xp}`);
console.log(`Rank: ${progress.rank}`);
console.log(`Achievements: ${progress.achievements.length}`);
```

### Award XP

```typescript
// Award XP for completing a task
leaderboard.awardXP(username, 100, "Completed Tutorial 1");

// Award achievement
leaderboard.unlockAchievement(username, "first_transaction");
```

### View Leaderboard

```typescript
// Get top 10 users
const topUsers = leaderboard.getTopUsers(10);

topUsers.forEach((user, index) => {
  console.log(`${index + 1}. ${user.name}: ${user.xp} XP`);
});
```

## Progress File

Your progress is stored locally in `.fleet-progress.json`:

```json
{
  "username": "developer123",
  "xp": 850,
  "rank": "Transaction Crafter",
  "achievements": [
    {
      "id": "first_transaction",
      "name": "First Transaction",
      "unlockedAt": "2025-01-15T10:30:00Z"
    }
  ],
  "completedTutorials": [1, 2],
  "testsPass": 86,
  "lastActive": "2025-01-15T14:45:00Z"
}
```

## Displaying Progress

### Terminal Output

```bash
$ npm run progress

🏆 Fleet SDK Progress
━━━━━━━━━━━━━━━━━━━━━

👤 Developer: developer123
⭐ XP: 850 / 1000
🎖️ Rank: 🥈 Apprentice Builder
📊 Progress: ████████░░ 85%

🏅 Achievements: 3/8
  ✅ First Transaction
  ✅ Token Handler  
  ✅ NFT Creator
  ⬜ Contract Interactor
  ⬜ Test Master
  ⬜ Testnet Explorer
  ⬜ Playground Champion
  ⬜ Ergo Master

📚 Tutorials: 3/4 completed
🧪 Tests: 86/86 passing
```

### Achievements Output

```bash
$ npm run achievements

🏆 All Achievements
━━━━━━━━━━━━━━━━━━━

✅ 🚀 First Transaction
   "Build your first valid transaction"
   Unlocked: Jan 15, 2025

✅ 🪙 Token Handler
   "Successfully transfer tokens"
   Unlocked: Jan 15, 2025

⬜ 🎨 NFT Creator
   "Mint your first NFT"
   Requirement: Complete Tutorial 3

⬜ 📜 Contract Interactor
   "Interact with a smart contract"
   Requirement: Complete Tutorial 4

...
```

## Customizing Achievements

You can add custom achievements by extending the leaderboard:

```typescript
import { Leaderboard, Achievement } from "../src/leaderboard";

const leaderboard = new Leaderboard();

// Add custom achievement
const customAchievement: Achievement = {
  id: "speed_demon",
  name: "Speed Demon",
  description: "Complete tutorial in under 5 minutes",
  icon: "⚡",
  xpReward: 200
};

leaderboard.registerAchievement(customAchievement);
```

## Integration with CI/CD

Track progress automatically in your CI pipeline:

```yaml
# .github/workflows/progress.yml
- name: Update Progress
  run: |
    npm test
    if [ $? -eq 0 ]; then
      npm run award-xp -- 50 "Passed all tests in CI"
    fi
```

## Next Steps

- [Start Tutorial 1](/tutorials/01-first-transaction) - Earn your first XP!
- [Try the Playground](/playground/) - Complete quests for badges
- [Connect to Testnet](/guides/testnet-integration) - Unlock explorer achievement
