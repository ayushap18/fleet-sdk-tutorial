/**
 * 🎮 Quest Runner - Gamified Test Experience
 * 
 * Run with: pnpm quest:start
 */

const QUESTS = {
  tier1: [
    { id: 1, name: "First Blood", xp: 100, test: "basic-transfer" },
    { id: 2, name: "Multi-Strike", xp: 100, test: "multi-output" },
  ],
  tier2: [
    { id: 3, name: "Token Slayer", xp: 200, test: "token-transfer" },
    { id: 4, name: "The Minting", xp: 200, test: "nft-minting" },
  ],
  tier3: [
    { id: 5, name: "Contract Conjurer", xp: 300, test: "contracts" },
    { id: 6, name: "The Vault", xp: 300, test: "multi-sig" },
  ],
  tier4: [
    { id: 7, name: "Oracle Whisperer", xp: 500, test: "oracle" },
    { id: 8, name: "DeFi Dragon", xp: 500, test: "defi" },
  ],
};

const RANKS = [
  { threshold: 0, title: "Novice Developer", emoji: "🥉" },
  { threshold: 300, title: "Code Warrior", emoji: "🥈" },
  { threshold: 700, title: "Smart Contract Pro", emoji: "🥇" },
  { threshold: 1200, title: "Chain Master", emoji: "👑" },
  { threshold: 2000, title: "Ergo Legend", emoji: "💎" },
];

const BADGES = {
  firstSteps: { name: "First Steps", emoji: "🟢", requirement: "Complete Quest 1" },
  batchMaster: { name: "Batch Master", emoji: "🔵", requirement: "Multi-output tx" },
  tokenHandler: { name: "Token Handler", emoji: "🟡", requirement: "Transfer tokens" },
  nftCreator: { name: "NFT Creator", emoji: "🟠", requirement: "Mint an NFT" },
  scriptMage: { name: "Script Mage", emoji: "🔴", requirement: "Deploy contract" },
  vaultKeeper: { name: "Vault Keeper", emoji: "🟣", requirement: "Create multi-sig" },
  oracleReader: { name: "Oracle Reader", emoji: "⚪", requirement: "Read oracle data" },
  defiDragon: { name: "DeFi Dragon", emoji: "🐉", requirement: "Execute swap" },
};

interface PlayerStats {
  xp: number;
  questsCompleted: number[];
  badges: string[];
  streak: number;
  totalTests: number;
}

function getPlayerStats(): PlayerStats {
  // In a real implementation, this would read from a file or API
  return {
    xp: 0,
    questsCompleted: [],
    badges: [],
    streak: 0,
    totalTests: 0,
  };
}

function getRank(xp: number): { title: string; emoji: string } {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].threshold) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

function getStreakMultiplier(streak: number): number {
  if (streak >= 10) return 2.0;
  if (streak >= 5) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
}

function displayWelcome(): void {
  const stats = getPlayerStats();
  const rank = getRank(stats.xp);
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎮 FLEET SDK ARENA                                      ║
║                                                           ║
║   Welcome back, Developer!                                ║
║                                                           ║
║   Current Rank: ${rank.emoji} ${rank.title.padEnd(20)}           ║
║   Total XP: ${String(stats.xp).padStart(5)} / 2000                           ║
║   Quests Completed: ${stats.questsCompleted.length} / 8                          ║
║   Streak: ${"🔥".repeat(Math.min(stats.streak, 5))} x${getStreakMultiplier(stats.streak)}                             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

function displayQuestMap(): void {
  console.log(`
🗺️ QUEST MAP
═══════════════════════════════════════════════════

    🏰 MASTER CITADEL (2000 XP)
         ╱╲
        ╱  ╲
    ⚔️ ARENA ⚔️
      ╱      ╲
     ╱        ╲
🔴 T4 LEGENDS   🔴 T4 LEGENDS
(Oracle/DeFi)    (500 XP each)
     ╲        ╱
      ╲      ╱
🟠 T3 CHAMPIONS  🟠 T3 CHAMPIONS
(Contracts)      (300 XP each)
     ╲        ╱
      ╲      ╱
   🟡 T2 WARRIORS 🟡
   (Tokens/NFTs)
   (200 XP each)
         │
   🟢 T1 APPRENTICE 🟢
   (Basic Transfers)
   (100 XP each)
         │
    🚪 YOU ARE HERE

═══════════════════════════════════════════════════
  `);
}

function displayQuests(): void {
  console.log(`
⚔️ AVAILABLE QUESTS
═══════════════════════════════════════════════════

🟢 TIER 1 - APPRENTICE (100 XP each)
   [ ] Quest 1: First Blood - Build first transaction
   [ ] Quest 2: Multi-Strike - Multi-output transaction

🟡 TIER 2 - WARRIOR (200 XP each)
   [ ] Quest 3: Token Slayer - Transfer tokens
   [ ] Quest 4: The Minting - Create an NFT

🟠 TIER 3 - CHAMPION (300 XP each)
   [ ] Quest 5: Contract Conjurer - Deploy contract
   [ ] Quest 6: The Vault - Multi-sig wallet

🔴 TIER 4 - LEGEND (500 XP each)
   [ ] Quest 7: Oracle Whisperer - Read oracle data
   [ ] Quest 8: DeFi Dragon - Execute DEX swap

═══════════════════════════════════════════════════
  `);
}

function displayBattleResult(passed: number, total: number, xpEarned: number): void {
  const allPassed = passed === total;
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ${allPassed ? "⚔️ BATTLE COMPLETE!" : "💀 BATTLE FAILED..."}                               ║
║                                                           ║
║   Tests Passed: ${String(passed).padStart(2)}/${String(total).padStart(2)}                                    ║
║   XP Earned: +${String(xpEarned).padStart(4)}                                      ║
${allPassed ? `║   Streak Bonus: 🔥 ACTIVE!                                ║` : `║   Streak: BROKEN                                         ║`}
║                                                           ║
${allPassed ? `║   🏅 Great work, warrior!                                 ║` : `║   💡 Tip: Check error messages for hints                 ║`}
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

function displayLeaderboard(): void {
  console.log(`
🏆 LEADERBOARD
═══════════════════════════════════════════════════

 #  | Player       | XP    | Badges | Title
----|--------------|-------|--------|----------------
 🥇 | 0x1337...   | 2,450 | 🏅🏅🏅🏅🏅 | Ergo Legend
 🥈 | 0xDEAD...   | 1,800 | 🏅🏅🏅🏅  | Chain Master
 🥉 | 0xBEEF...   | 1,200 | 🏅🏅🏅   | SC Pro
  4 | 0xCAFE...   |   900 | 🏅🏅    | Token Warrior
  5 | YOU         |     0 | -      | Novice

═══════════════════════════════════════════════════
  `);
}

// Main execution
console.log("\n");
displayWelcome();
displayQuestMap();
displayQuests();
displayLeaderboard();

console.log(`
💡 QUICK COMMANDS
═══════════════════════════════════════════════════

  pnpm test              Run all battles
  pnpm test:watch        Watch mode (auto-retry)
  pnpm test:coverage     Full coverage report
  pnpm quest:score       View your stats

═══════════════════════════════════════════════════

🚀 Ready to begin? Run: pnpm test
`);

export {
  QUESTS,
  RANKS,
  BADGES,
  getPlayerStats,
  getRank,
  getStreakMultiplier,
  displayWelcome,
  displayBattleResult,
};
