/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🏆 XP LEADERBOARD SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Track your progress as you complete quests and tests.
 * Earn XP, unlock achievements, and climb the leaderboard!
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as fs from "fs";
import * as path from "path";

// ════════════════════════════════════════
// 📊 TYPES
// ════════════════════════════════════════

interface PlayerProgress {
  username: string;
  totalXP: number;
  completedQuests: string[];
  completedTests: string[];
  achievements: Achievement[];
  lastActive: string;
  startedAt: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  unlockedAt: string;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  totalXP: number;
  questsCompleted: number;
  achievements: number;
}

// ════════════════════════════════════════
// 🏅 ACHIEVEMENTS
// ════════════════════════════════════════

const ACHIEVEMENTS: Omit<Achievement, "unlockedAt">[] = [
  {
    id: "first-blood",
    name: "First Blood",
    description: "Complete your first test",
    xpReward: 10,
  },
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Complete the basic transfer quest",
    xpReward: 25,
  },
  {
    id: "token-master",
    name: "Token Master",
    description: "Complete all token-related tests",
    xpReward: 50,
  },
  {
    id: "box-wizard",
    name: "Box Wizard",
    description: "Understand the UTXO model completely",
    xpReward: 75,
  },
  {
    id: "chain-explorer",
    name: "Chain Explorer",
    description: "Connect to testnet successfully",
    xpReward: 100,
  },
  {
    id: "speed-runner",
    name: "Speed Runner",
    description: "Complete all quests in one session",
    xpReward: 150,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete all tests with 100% pass rate",
    xpReward: 200,
  },
  {
    id: "fleet-master",
    name: "Fleet Master",
    description: "Earn 1000+ total XP",
    xpReward: 500,
  },
];

// ════════════════════════════════════════
// 💾 DATA PERSISTENCE
// ════════════════════════════════════════

const DATA_FILE = path.join(process.cwd(), ".fleet-progress.json");

function loadProgress(): PlayerProgress | null {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Ignore errors
  }
  return null;
}

function saveProgress(progress: PlayerProgress): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(progress, null, 2));
}

function initProgress(username: string): PlayerProgress {
  return {
    username,
    totalXP: 0,
    completedQuests: [],
    completedTests: [],
    achievements: [],
    lastActive: new Date().toISOString(),
    startedAt: new Date().toISOString(),
  };
}

// ════════════════════════════════════════
// 🎮 PROGRESS TRACKER
// ════════════════════════════════════════

export class ProgressTracker {
  private progress: PlayerProgress;

  constructor(username?: string) {
    const existing = loadProgress();
    this.progress = existing || initProgress(username || "Anonymous");
  }

  /**
   * Add XP and check for achievements
   */
  addXP(amount: number, source: string): void {
    this.progress.totalXP += amount;
    this.progress.lastActive = new Date().toISOString();
    
    console.log(`\n✨ +${amount} XP from: ${source}`);
    console.log(`🏆 Total XP: ${this.progress.totalXP}`);
    
    this.checkAchievements();
    this.save();
  }

  /**
   * Mark a quest as completed
   */
  completeQuest(questId: string, xp: number): void {
    if (!this.progress.completedQuests.includes(questId)) {
      this.progress.completedQuests.push(questId);
      this.addXP(xp, `Quest: ${questId}`);
    }
  }

  /**
   * Mark a test as completed
   */
  completeTest(testId: string, xp: number): void {
    if (!this.progress.completedTests.includes(testId)) {
      this.progress.completedTests.push(testId);
      this.addXP(xp, `Test: ${testId}`);
    }
  }

  /**
   * Check and unlock achievements
   */
  private checkAchievements(): void {
    const unlockedIds = this.progress.achievements.map((a) => a.id);

    // First Blood
    if (
      this.progress.completedTests.length >= 1 &&
      !unlockedIds.includes("first-blood")
    ) {
      this.unlockAchievement("first-blood");
    }

    // Getting Started
    if (
      this.progress.completedQuests.includes("basic-transfer") &&
      !unlockedIds.includes("getting-started")
    ) {
      this.unlockAchievement("getting-started");
    }

    // Fleet Master
    if (this.progress.totalXP >= 1000 && !unlockedIds.includes("fleet-master")) {
      this.unlockAchievement("fleet-master");
    }
  }

  /**
   * Unlock an achievement
   */
  private unlockAchievement(achievementId: string): void {
    const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) return;

    this.progress.achievements.push({
      ...achievement,
      unlockedAt: new Date().toISOString(),
    });

    console.log(`\n🏅 ACHIEVEMENT UNLOCKED: ${achievement.name}!`);
    console.log(`   "${achievement.description}"`);
    console.log(`   +${achievement.xpReward} Bonus XP`);

    this.progress.totalXP += achievement.xpReward;
  }

  /**
   * Get current progress
   */
  getProgress(): PlayerProgress {
    return { ...this.progress };
  }

  /**
   * Display progress summary
   */
  displaySummary(): void {
    console.log("\n════════════════════════════════════════");
    console.log("📊 YOUR PROGRESS");
    console.log("════════════════════════════════════════");
    console.log(`👤 Player: ${this.progress.username}`);
    console.log(`🏆 Total XP: ${this.progress.totalXP}`);
    console.log(`📋 Quests Completed: ${this.progress.completedQuests.length}`);
    console.log(`🧪 Tests Completed: ${this.progress.completedTests.length}`);
    console.log(`🏅 Achievements: ${this.progress.achievements.length}/${ACHIEVEMENTS.length}`);
    console.log("════════════════════════════════════════\n");
  }

  /**
   * Display achievements
   */
  displayAchievements(): void {
    console.log("\n🏅 ACHIEVEMENTS\n");
    
    for (const achievement of ACHIEVEMENTS) {
      const unlocked = this.progress.achievements.find(
        (a) => a.id === achievement.id
      );
      
      const status = unlocked ? "✅" : "🔒";
      console.log(`${status} ${achievement.name} (+${achievement.xpReward} XP)`);
      console.log(`   ${achievement.description}`);
      if (unlocked) {
        console.log(`   Unlocked: ${new Date(unlocked.unlockedAt).toLocaleDateString()}`);
      }
      console.log();
    }
  }

  /**
   * Save progress
   */
  save(): void {
    saveProgress(this.progress);
  }
}

// ════════════════════════════════════════
// 🏆 LEADERBOARD
// ════════════════════════════════════════

// Mock leaderboard data (in production, this would be from a server)
const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "ErgoMaster2025", totalXP: 2500, questsCompleted: 12, achievements: 8 },
  { rank: 2, username: "SigmaChad", totalXP: 2100, questsCompleted: 10, achievements: 7 },
  { rank: 3, username: "BoxWizard", totalXP: 1800, questsCompleted: 9, achievements: 6 },
  { rank: 4, username: "UTXOKing", totalXP: 1500, questsCompleted: 8, achievements: 5 },
  { rank: 5, username: "FleetRookie", totalXP: 1200, questsCompleted: 7, achievements: 4 },
];

export function displayLeaderboard(tracker?: ProgressTracker): void {
  console.log("\n════════════════════════════════════════════════════════");
  console.log("🏆 GLOBAL LEADERBOARD");
  console.log("════════════════════════════════════════════════════════\n");
  console.log("Rank │ Player            │ XP     │ Quests │ 🏅");
  console.log("─────┼───────────────────┼────────┼────────┼────");

  for (const entry of MOCK_LEADERBOARD) {
    const rankStr = entry.rank.toString().padStart(2);
    const nameStr = entry.username.padEnd(17);
    const xpStr = entry.totalXP.toString().padStart(6);
    const questStr = entry.questsCompleted.toString().padStart(6);
    
    console.log(`  ${rankStr} │ ${nameStr} │ ${xpStr} │ ${questStr} │ ${entry.achievements}`);
  }

  if (tracker) {
    const progress = tracker.getProgress();
    console.log("─────┼───────────────────┼────────┼────────┼────");
    console.log(`  ?? │ ${progress.username.padEnd(17).slice(0, 17)} │ ${progress.totalXP.toString().padStart(6)} │ ${progress.completedQuests.length.toString().padStart(6)} │ ${progress.achievements.length} (You)`);
  }

  console.log("\n════════════════════════════════════════════════════════\n");
}

// ════════════════════════════════════════
// 🎮 CLI INTERFACE
// ════════════════════════════════════════

async function main() {
  const args = process.argv.slice(2);
  const tracker = new ProgressTracker();

  if (args.includes("--leaderboard") || args.includes("-l")) {
    displayLeaderboard(tracker);
  } else if (args.includes("--achievements") || args.includes("-a")) {
    tracker.displayAchievements();
  } else if (args.includes("--reset")) {
    if (fs.existsSync(DATA_FILE)) {
      fs.unlinkSync(DATA_FILE);
      console.log("✅ Progress reset!");
    }
  } else {
    tracker.displaySummary();
    console.log("Commands:");
    console.log("  --leaderboard, -l  Show global leaderboard");
    console.log("  --achievements, -a Show all achievements");
    console.log("  --reset           Reset your progress");
  }
}

// Run if executed directly
if (process.argv[1]?.includes("leaderboard")) {
  main();
}

export default { ProgressTracker, displayLeaderboard, ACHIEVEMENTS };
