/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚔️ QUEST: Oracle Data Fetch
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 Objective: Fetch and use real-world data from Ergo oracles
 * 📋 Prerequisites: Understanding of boxes and registers
 * ⏱️ Completion Time: ~15 minutes
 * ⭐ Difficulty: Medium
 * 
 * 🏆 Rewards Upon Completion:
 * - Understanding of oracle pools
 * - Reading data from oracle boxes
 * - Using price feeds in transactions
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { 
  TransactionBuilder, 
  OutputBuilder,
  RECOMMENDED_MIN_FEE_VALUE,
  SAFE_MIN_BOX_VALUE,
  type Box
} from "@fleet-sdk/core";

// ════════════════════════════════════════
// 🌐 ORACLE CONFIGURATION
// ════════════════════════════════════════

/**
 * Oracle Pool NFT Token IDs
 * These identify the official oracle pools on Ergo
 */
const ORACLE_POOL_NFTS = {
  // ERG/USD Price Oracle
  ERG_USD: "011d3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6edd92ba",
  
  // ERG/Gold Oracle (hypothetical)
  ERG_GOLD: "02a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
  
  // Random Number Oracle
  RANDOM: "03f1e2d3c4b5a6978899aabbccddeeff00112233445566778899aabbccddeeff",
};

/**
 * Oracle Data Types
 */
interface OracleData {
  poolNft: string;
  datapoint: bigint;
  epochId: number;
  timestamp: Date;
  source: string;
}

interface PriceData extends OracleData {
  baseAsset: string;
  quoteAsset: string;
  price: number;
  decimals: number;
}

// ════════════════════════════════════════
// 📦 MOCK ORACLE DATA
// ════════════════════════════════════════

/**
 * Simulated ERG/USD Oracle Box
 * In production, fetch from blockchain explorer
 */
const mockErgUsdOracleBox: Box<bigint> = {
  boxId: "oracle-erg-usd-latest",
  value: 1_000_000n,  // Minimal ERG
  ergoTree: "0008cd...",  // Oracle pool contract
  creationHeight: 1_199_950,
  assets: [
    {
      tokenId: ORACLE_POOL_NFTS.ERG_USD,
      amount: 1n  // Pool NFT
    }
  ],
  additionalRegisters: {
    // R4: Price datapoint (ERG/USD in nanoERG per USD cent)
    R4: "05a09c01",  // Encoded: 2.15 USD
    // R5: Epoch ID
    R5: "04c801",    // Encoded: 100
  },
  transactionId: "oracle-update-tx",
  index: 0
};

/**
 * Decoded oracle data
 */
const mockOraclePrice: PriceData = {
  poolNft: ORACLE_POOL_NFTS.ERG_USD,
  datapoint: 215_000_000n,  // 2.15 USD in micro-USD
  epochId: 100,
  timestamp: new Date(),
  source: "ERG/USD Oracle Pool",
  baseAsset: "ERG",
  quoteAsset: "USD",
  price: 2.15,
  decimals: 6
};

// ════════════════════════════════════════
// 📦 CONFIGURATION
// ════════════════════════════════════════

const CONFIG = {
  /** Amount of ERG to sell */
  ergToSell: 10_000_000_000n,  // 10 ERG
  
  /** Minimum USD value expected (slippage protection) */
  minUsdValue: 20_000_000n,  // $20 minimum (in micro-USD)
  
  /** Change address */
  changeAddress: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
  
  /** Current height */
  currentHeight: 1_200_000,
};

// ════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════

function formatErg(nanoErg: bigint): string {
  return `${(Number(nanoErg) / 1_000_000_000).toFixed(4)} ERG`;
}

function formatUsd(microUsd: bigint): string {
  return `$${(Number(microUsd) / 1_000_000).toFixed(2)}`;
}

/**
 * Decode oracle datapoint from register
 * In production, use proper serializer
 */
function decodeDatapoint(encoded: string): bigint {
  // Simplified mock - real implementation uses SigmaByteReader
  return mockOraclePrice.datapoint;
}

/**
 * Calculate ERG value in USD using oracle price
 */
function calculateUsdValue(nanoErg: bigint, priceData: PriceData): bigint {
  // price is in micro-USD per ERG
  const microUsd = (nanoErg * BigInt(Math.floor(priceData.price * 1_000_000))) / 1_000_000_000n;
  return microUsd;
}

/**
 * Fetch oracle box from blockchain
 * In production, use blockchain-providers
 */
async function fetchOracleBox(poolNft: string): Promise<Box<bigint>> {
  console.log(`   Querying oracle pool: ${poolNft.slice(0, 16)}...`);
  console.log("   Searching for latest oracle box...");
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockErgUsdOracleBox;
}

/**
 * Parse oracle data from box registers
 */
function parseOracleData(box: Box<bigint>): PriceData {
  // In production, decode from additionalRegisters
  return mockOraclePrice;
}

// ════════════════════════════════════════
// 🎮 MAIN QUEST FUNCTIONS
// ════════════════════════════════════════

/**
 * Step 1: Fetch Oracle Data
 */
async function fetchOracleData(): Promise<PriceData> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 1: Fetch Oracle Data");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 🔍 Query Oracle Pool
  // ────────────────────────────────────
  console.log("🔍 Querying ERG/USD Oracle Pool...\n");
  
  const oracleBox = await fetchOracleBox(ORACLE_POOL_NFTS.ERG_USD);
  
  console.log("   📦 Oracle Box Found:");
  console.log(`      Box ID: ${oracleBox.boxId}`);
  console.log(`      Height: ${oracleBox.creationHeight}`);
  console.log("");

  // ────────────────────────────────────
  // 📊 Parse Price Data
  // ────────────────────────────────────
  console.log("📊 Parsing oracle data from registers...\n");
  
  const priceData = parseOracleData(oracleBox);
  
  console.log("   Oracle Data:");
  console.log("   ┌────────────────────────────────────────┐");
  console.log(`   │ Pair:      ${priceData.baseAsset}/${priceData.quoteAsset}`);
  console.log(`   │ Price:     $${priceData.price.toFixed(2)} per ERG`);
  console.log(`   │ Epoch:     ${priceData.epochId}`);
  console.log(`   │ Updated:   ${priceData.timestamp.toISOString()}`);
  console.log(`   │ Source:    ${priceData.source}`);
  console.log("   └────────────────────────────────────────┘");
  console.log("");

  return priceData;
}

/**
 * Step 2: Calculate Values
 */
async function calculateValues(priceData: PriceData): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 2: Calculate USD Values");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 💰 Calculate ERG → USD
  // ────────────────────────────────────
  console.log("💰 Calculating USD value of ERG holdings...\n");
  
  const ergAmounts = [
    1_000_000_000n,    // 1 ERG
    10_000_000_000n,   // 10 ERG
    100_000_000_000n,  // 100 ERG
    1000_000_000_000n, // 1000 ERG
  ];
  
  console.log("   ERG Amount       →    USD Value");
  console.log("   ─────────────────────────────────");
  
  ergAmounts.forEach(ergAmount => {
    const usdValue = calculateUsdValue(ergAmount, priceData);
    console.log(`   ${formatErg(ergAmount).padEnd(15)} →    ${formatUsd(usdValue)}`);
  });
  
  console.log("");

  // ────────────────────────────────────
  // 🎯 Your Transaction
  // ────────────────────────────────────
  console.log("🎯 Your Transaction:");
  console.log("─".repeat(50));
  
  const yourUsdValue = calculateUsdValue(CONFIG.ergToSell, priceData);
  
  console.log(`   Selling:        ${formatErg(CONFIG.ergToSell)}`);
  console.log(`   Oracle Price:   $${priceData.price.toFixed(2)}/ERG`);
  console.log(`   USD Value:      ${formatUsd(yourUsdValue)}`);
  console.log(`   Min Expected:   ${formatUsd(CONFIG.minUsdValue)}`);
  console.log(`   Slippage OK:    ${yourUsdValue >= CONFIG.minUsdValue ? "✓ YES" : "✗ NO"}`);
  console.log("");
}

/**
 * Step 3: Use Oracle in Contract
 */
async function useOracleInContract(priceData: PriceData): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 3: Oracle-Gated Transaction");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 📜 Oracle-Aware Contract
  // ────────────────────────────────────
  console.log("📜 Oracle-Aware Contract Example:");
  console.log("─".repeat(50));
  console.log(`
   // ErgoScript that reads oracle data
   {
     // Find oracle box by NFT
     val oracleBox = CONTEXT.dataInputs(0)
     val oracleNft = oracleBox.tokens(0)._1
     
     // Verify it's the official oracle
     val validOracle = oracleNft == fromBase16("${ORACLE_POOL_NFTS.ERG_USD.slice(0, 16)}...")
     
     // Read price from R4
     val ergUsdPrice = oracleBox.R4[Long].get
     
     // Calculate USD value of this box
     val boxUsdValue = SELF.value * ergUsdPrice / 1000000000L
     
     // Only allow spending if USD value > threshold
     val minUsdValue = 20000000L  // $20
     
     sigmaProp(validOracle && boxUsdValue >= minUsdValue)
   }
  `);
  console.log("─".repeat(50));
  console.log("");

  // ────────────────────────────────────
  // 📦 Transaction with Data Input
  // ────────────────────────────────────
  console.log("📦 Building transaction with oracle data input...\n");
  
  // Mock input box
  const userBox: Box<bigint> = {
    boxId: "user-box-to-spend",
    value: CONFIG.ergToSell,
    ergoTree: "0008cd...",
    creationHeight: 1_100_000,
    assets: [],
    additionalRegisters: {},
    transactionId: "prev-tx",
    index: 0
  };
  
  console.log("   📥 Inputs:");
  console.log(`      [0] User Box: ${formatErg(userBox.value)}`);
  
  console.log("\n   📊 Data Inputs (Read-Only):");
  console.log(`      [0] Oracle Box: ERG/USD = $${priceData.price.toFixed(2)}`);
  
  // Note: Fleet SDK supports data inputs via .withDataFrom()
  // const tx = new TransactionBuilder(height)
  //   .from(inputs)
  //   .withDataFrom([oracleBox])
  //   .to(outputs)
  //   .build();
  
  console.log("\n   📤 Outputs:");
  const outputValue = userBox.value - RECOMMENDED_MIN_FEE_VALUE;
  console.log(`      [0] Recipient: ${formatErg(outputValue)}`);
  
  console.log(`\n   ⛽ Fee: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
  console.log("");
}

/**
 * Show oracle resources
 */
function showOracleResources(): void {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("📚 Oracle Resources");
  console.log("═".repeat(60));
  console.log("\n");

  console.log("🌐 Available Oracle Pools:");
  console.log("");
  
  const oracles = [
    { name: "ERG/USD", status: "Active", url: "Oracle Pool v2" },
    { name: "ERG/ADA", status: "Active", url: "Cross-chain" },
    { name: "ERG/BTC", status: "Active", url: "Bitcoin price" },
    { name: "Random", status: "Active", url: "VRF randomness" },
  ];
  
  oracles.forEach(o => {
    console.log(`   • ${o.name.padEnd(10)} [${o.status}] - ${o.url}`);
  });
  
  console.log("\n📖 Documentation:");
  console.log("   • Oracle Pools: docs.ergoplatform.com/uses/oracles/");
  console.log("   • Data Inputs: fleet-sdk.github.io/docs/data-inputs");
  console.log("   • Explorer: explorer.ergoplatform.com/oracle-pools\n");
}

// ════════════════════════════════════════
// 🎬 EXECUTE QUEST
// ════════════════════════════════════════

async function main() {
  try {
    const priceData = await fetchOracleData();
    await calculateValues(priceData);
    await useOracleInContract(priceData);
    showOracleResources();
    
    console.log("🏆 QUEST COMPLETE!");
    console.log("   Achievement Unlocked: Oracle Reader\n");
    console.log("✨ Example completed successfully!\n");
    
  } catch (err) {
    console.error("💀 Fatal error:", (err as Error).message);
    process.exit(1);
  }
}

main();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 LORE: Ergo Oracle Pools
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Oracles bring real-world data onto the blockchain:
 * 
 * 1. HOW ORACLES WORK
 *    - Data providers submit updates to oracle pool
 *    - Consensus mechanism validates data
 *    - Latest value stored in oracle box registers
 *    - Anyone can read using data inputs
 * 
 * 2. DATA INPUTS
 *    - Read-only boxes in transactions
 *    - Don't need to be spent/consumed
 *    - Allow reading state without ownership
 *    - Perfect for oracle price feeds
 * 
 * 3. SECURITY
 *    - Verify oracle NFT to ensure authenticity
 *    - Check box age (avoid stale data)
 *    - Consider multiple oracles for redundancy
 *    - Add slippage protection in contracts
 * 
 * 4. USE CASES
 *    - Price feeds for DeFi
 *    - Random numbers for games
 *    - Weather data for insurance
 *    - Sports scores for betting
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
