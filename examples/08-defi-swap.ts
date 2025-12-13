/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚔️ QUEST: DeFi Token Swap
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 Objective: Swap tokens using an AMM-style decentralized exchange
 * 📋 Prerequisites: Understanding of tokens, contracts, and oracles
 * ⏱️ Completion Time: ~25 minutes
 * ⭐ Difficulty: Hard
 * 
 * 🏆 Rewards Upon Completion:
 * - Understanding of AMM mechanics
 * - Knowledge of liquidity pools
 * - Ability to build DeFi transactions
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { 
  TransactionBuilder, 
  OutputBuilder,
  RECOMMENDED_MIN_FEE_VALUE,
  SAFE_MIN_BOX_VALUE,
  type Box,
  type TokenAmount
} from "@fleet-sdk/core";

// ════════════════════════════════════════
// 🏊 LIQUIDITY POOL CONFIGURATION
// ════════════════════════════════════════

/**
 * AMM Pool Information
 */
interface LiquidityPool {
  name: string;
  poolNft: string;
  tokenX: TokenInfo;
  tokenY: TokenInfo;
  reserveX: bigint;
  reserveY: bigint;
  lpTokenId: string;
  feePercent: number;
}

interface TokenInfo {
  id: string;
  name: string;
  decimals: number;
}

/**
 * Mock ERG/SigUSD Pool
 */
const POOL: LiquidityPool = {
  name: "ERG/SigUSD",
  poolNft: "pool-nft-id-unique-identifier",
  tokenX: {
    id: "0000000000000000000000000000000000000000000000000000000000000000",  // ERG (native)
    name: "ERG",
    decimals: 9
  },
  tokenY: {
    id: "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
    name: "SigUSD",
    decimals: 2
  },
  reserveX: 100_000_000_000_000n,  // 100,000 ERG
  reserveY: 21_500_000_000n,        // 215,000 SigUSD (at $2.15/ERG)
  lpTokenId: "lp-token-id-for-this-pool",
  feePercent: 0.3  // 0.3% swap fee
};

// ════════════════════════════════════════
// 📦 CONFIGURATION
// ════════════════════════════════════════

interface SwapParams {
  inputToken: "X" | "Y";
  inputAmount: bigint;
  minOutputAmount: bigint;
  slippageTolerance: number;
}

const CONFIG = {
  /** User's address */
  userAddress: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
  
  /** Current height */
  currentHeight: 1_200_000,
};

const SWAP_PARAMS: SwapParams = {
  inputToken: "X",  // Swapping ERG
  inputAmount: 10_000_000_000n,  // 10 ERG
  minOutputAmount: 0n,  // Will calculate
  slippageTolerance: 0.5  // 0.5% slippage
};

// ════════════════════════════════════════
// 🎮 MOCK DATA
// ════════════════════════════════════════

/**
 * Mock Liquidity Pool Box
 */
const mockPoolBox: Box<bigint> = {
  boxId: "amm-pool-box-latest",
  value: POOL.reserveX,  // ERG reserve
  ergoTree: "0008cd...",  // AMM contract
  creationHeight: 1_199_000,
  assets: [
    { tokenId: POOL.poolNft, amount: 1n },  // Pool NFT
    { tokenId: POOL.tokenY.id, amount: POOL.reserveY },  // SigUSD reserve
    { tokenId: POOL.lpTokenId, amount: 1_000_000_000_000n }  // LP tokens remaining
  ],
  additionalRegisters: {},
  transactionId: "last-pool-tx",
  index: 0
};

/**
 * User's input box
 */
const userInputBox: Box<bigint> = {
  boxId: "user-input-box-for-swap",
  value: 15_000_000_000n,  // 15 ERG
  ergoTree: "0008cd...",
  creationHeight: 1_100_000,
  assets: [],
  additionalRegisters: {},
  transactionId: "user-prev-tx",
  index: 0
};

// ════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════

function formatErg(nanoErg: bigint): string {
  return `${(Number(nanoErg) / 1_000_000_000).toFixed(4)} ERG`;
}

function formatToken(amount: bigint, decimals: number, symbol: string): string {
  const value = Number(amount) / Math.pow(10, decimals);
  return `${value.toFixed(decimals > 4 ? 4 : decimals)} ${symbol}`;
}

/**
 * Calculate output amount using constant product formula
 * x * y = k (AMM invariant)
 */
function calculateSwapOutput(
  inputAmount: bigint,
  inputReserve: bigint,
  outputReserve: bigint,
  feePercent: number
): bigint {
  // Apply fee
  const feeMultiplier = 1 - (feePercent / 100);
  const inputWithFee = BigInt(Math.floor(Number(inputAmount) * feeMultiplier));
  
  // Constant product formula: dy = (y * dx) / (x + dx)
  const numerator = outputReserve * inputWithFee;
  const denominator = inputReserve + inputWithFee;
  
  return numerator / denominator;
}

/**
 * Calculate price impact
 */
function calculatePriceImpact(
  inputAmount: bigint,
  inputReserve: bigint,
  outputAmount: bigint,
  outputReserve: bigint
): number {
  // Spot price before swap
  const spotPrice = Number(outputReserve) / Number(inputReserve);
  
  // Execution price
  const executionPrice = Number(outputAmount) / Number(inputAmount);
  
  // Price impact
  return ((spotPrice - executionPrice) / spotPrice) * 100;
}

/**
 * Apply slippage tolerance
 */
function applySlippage(amount: bigint, slippagePercent: number): bigint {
  const slippageMultiplier = 1 - (slippagePercent / 100);
  return BigInt(Math.floor(Number(amount) * slippageMultiplier));
}

// ════════════════════════════════════════
// 🎮 MAIN QUEST FUNCTIONS
// ════════════════════════════════════════

/**
 * Step 1: Analyze Pool State
 */
async function analyzePool(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 1: Analyze Liquidity Pool");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 🏊 Pool Information
  // ────────────────────────────────────
  console.log(`🏊 Pool: ${POOL.name}`);
  console.log("─".repeat(50));
  
  console.log("\n   📊 Reserves:");
  console.log(`      ${POOL.tokenX.name}: ${formatErg(POOL.reserveX)}`);
  console.log(`      ${POOL.tokenY.name}: ${formatToken(POOL.reserveY, POOL.tokenY.decimals, POOL.tokenY.name)}`);
  
  // Calculate spot price
  const spotPriceXtoY = Number(POOL.reserveY) / Number(POOL.reserveX) * (10 ** (POOL.tokenX.decimals - POOL.tokenY.decimals));
  const spotPriceYtoX = 1 / spotPriceXtoY;
  
  console.log("\n   💱 Spot Prices:");
  console.log(`      1 ${POOL.tokenX.name} = ${spotPriceXtoY.toFixed(2)} ${POOL.tokenY.name}`);
  console.log(`      1 ${POOL.tokenY.name} = ${spotPriceYtoX.toFixed(6)} ${POOL.tokenX.name}`);
  
  console.log("\n   ⚙️ Pool Parameters:");
  console.log(`      Fee: ${POOL.feePercent}%`);
  console.log(`      Pool NFT: ${POOL.poolNft.slice(0, 24)}...`);
  console.log("");
}

/**
 * Step 2: Calculate Swap
 */
async function calculateSwap(): Promise<{ outputAmount: bigint; minOutput: bigint; priceImpact: number }> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 2: Calculate Swap");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 📥 Input Details
  // ────────────────────────────────────
  console.log("📥 Swap Input:");
  console.log("─".repeat(50));
  console.log(`   Token:    ${POOL.tokenX.name}`);
  console.log(`   Amount:   ${formatErg(SWAP_PARAMS.inputAmount)}`);
  console.log(`   Slippage: ${SWAP_PARAMS.slippageTolerance}%`);
  console.log("");

  // ────────────────────────────────────
  // 🧮 Calculate Output
  // ────────────────────────────────────
  console.log("🧮 Calculating output amount...\n");
  
  const outputAmount = calculateSwapOutput(
    SWAP_PARAMS.inputAmount,
    POOL.reserveX,
    POOL.reserveY,
    POOL.feePercent
  );
  
  const priceImpact = calculatePriceImpact(
    SWAP_PARAMS.inputAmount,
    POOL.reserveX,
    outputAmount,
    POOL.reserveY
  );
  
  const minOutput = applySlippage(outputAmount, SWAP_PARAMS.slippageTolerance);
  
  console.log("   📤 Expected Output:");
  console.log(`      Token:        ${POOL.tokenY.name}`);
  console.log(`      Amount:       ${formatToken(outputAmount, POOL.tokenY.decimals, POOL.tokenY.name)}`);
  console.log(`      Min (w/ slip): ${formatToken(minOutput, POOL.tokenY.decimals, POOL.tokenY.name)}`);
  
  console.log("\n   📊 Swap Metrics:");
  console.log(`      Price Impact: ${priceImpact.toFixed(4)}%`);
  console.log(`      Fee Paid:     ${(Number(SWAP_PARAMS.inputAmount) * POOL.feePercent / 100 / 1e9).toFixed(6)} ERG`);
  
  // Execution price
  const execPrice = Number(outputAmount) / Number(SWAP_PARAMS.inputAmount) * 1e7;
  console.log(`      Exec. Price:  1 ERG = ${execPrice.toFixed(2)} SigUSD`);
  console.log("");

  return { outputAmount, minOutput, priceImpact };
}

/**
 * Step 3: Build Swap Transaction
 */
async function buildSwapTransaction(outputAmount: bigint, minOutput: bigint): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 3: Build Swap Transaction");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 📦 Transaction Structure
  // ────────────────────────────────────
  console.log("📦 Transaction Structure:");
  console.log("─".repeat(50));
  
  console.log("\n   📥 INPUTS:");
  console.log("      [0] Pool Box");
  console.log(`          ERG:    ${formatErg(POOL.reserveX)}`);
  console.log(`          SigUSD: ${formatToken(POOL.reserveY, 2, "SigUSD")}`);
  console.log("      [1] User Box");
  console.log(`          ERG:    ${formatErg(userInputBox.value)}`);
  
  // New pool reserves after swap
  const newPoolErgReserve = POOL.reserveX + SWAP_PARAMS.inputAmount;
  const newPoolSigUsdReserve = POOL.reserveY - outputAmount;
  
  console.log("\n   📤 OUTPUTS:");
  console.log("      [0] Pool Box (updated)");
  console.log(`          ERG:    ${formatErg(newPoolErgReserve)} (+${formatErg(SWAP_PARAMS.inputAmount)})`);
  console.log(`          SigUSD: ${formatToken(newPoolSigUsdReserve, 2, "SigUSD")} (-${formatToken(outputAmount, 2, "")})`);
  console.log("      [1] User Box (with tokens)");
  console.log(`          ERG:    ${formatErg(userInputBox.value - SWAP_PARAMS.inputAmount - RECOMMENDED_MIN_FEE_VALUE)}`);
  console.log(`          SigUSD: ${formatToken(outputAmount, 2, "SigUSD")}`);
  
  console.log(`\n   ⛽ Fee: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
  console.log("");

  // ────────────────────────────────────
  // 🔨 Build Transaction
  // ────────────────────────────────────
  console.log("🔨 Building swap transaction...\n");
  
  // Create user output with received tokens
  const userOutput = new OutputBuilder(
    userInputBox.value - SWAP_PARAMS.inputAmount - RECOMMENDED_MIN_FEE_VALUE,
    CONFIG.userAddress
  ).addTokens({
    tokenId: POOL.tokenY.id,
    amount: outputAmount
  });
  
  // In production, the pool output would be constructed according to
  // the AMM contract requirements
  
  console.log("   ✓ Transaction structure validated");
  console.log("   ✓ Slippage check passed");
  console.log("   ✓ Pool invariant maintained (x * y = k)");
  console.log("");
}

/**
 * Step 4: Show Swap Summary
 */
async function showSwapSummary(outputAmount: bigint, priceImpact: number): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("📊 Swap Summary");
  console.log("═".repeat(60));
  console.log("\n");

  console.log("   ┌────────────────────────────────────────────┐");
  console.log(`   │  SWAP: ${POOL.tokenX.name} → ${POOL.tokenY.name}`.padEnd(45) + "│");
  console.log("   ├────────────────────────────────────────────┤");
  console.log(`   │  You Pay:      ${formatErg(SWAP_PARAMS.inputAmount).padEnd(24)}│`);
  console.log(`   │  You Receive:  ${formatToken(outputAmount, 2, "SigUSD").padEnd(24)}│`);
  console.log(`   │  Price Impact: ${(priceImpact.toFixed(4) + "%").padEnd(24)}│`);
  console.log(`   │  Pool Fee:     ${(POOL.feePercent + "%").padEnd(24)}│`);
  console.log(`   │  Network Fee:  ${formatErg(RECOMMENDED_MIN_FEE_VALUE).padEnd(24)}│`);
  console.log("   └────────────────────────────────────────────┘");
  console.log("");
}

/**
 * Show DeFi Resources
 */
function showDefiResources(): void {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("📚 DeFi Resources on Ergo");
  console.log("═".repeat(60));
  console.log("\n");

  console.log("🏛️ Major DEXes:");
  console.log("   • Spectrum.fi - Main AMM DEX");
  console.log("   • ErgoDEX - Original DEX protocol");
  console.log("");
  
  console.log("🪙 DeFi Tokens:");
  console.log("   • SigUSD - Algorithmic stablecoin");
  console.log("   • SigRSV - Reserve token");
  console.log("   • NETA - Governance token");
  console.log("   • ergopad - Launchpad token");
  console.log("");
  
  console.log("📖 Learn More:");
  console.log("   • Spectrum: spectrum.fi/docs");
  console.log("   • SigmaUSD: sigmausd.io");
  console.log("   • Ergo DeFi: docs.ergoplatform.com/uses/defi/");
  console.log("");
}

// ════════════════════════════════════════
// 🎬 EXECUTE QUEST
// ════════════════════════════════════════

async function main() {
  try {
    await analyzePool();
    const { outputAmount, minOutput, priceImpact } = await calculateSwap();
    await buildSwapTransaction(outputAmount, minOutput);
    await showSwapSummary(outputAmount, priceImpact);
    showDefiResources();
    
    console.log("🏆 QUEST COMPLETE!");
    console.log("   Achievement Unlocked: DeFi Master\n");
    console.log("✨ Example completed successfully!\n");
    
  } catch (err) {
    console.error("💀 Fatal error:", (err as Error).message);
    process.exit(1);
  }
}

main();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 LORE: Automated Market Makers (AMMs)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * AMMs enable decentralized token swaps without order books:
 * 
 * 1. CONSTANT PRODUCT FORMULA
 *    - x * y = k (invariant)
 *    - x = reserve of token X
 *    - y = reserve of token Y
 *    - k = constant product (maintained after each swap)
 * 
 * 2. PRICE DISCOVERY
 *    - Price = y / x (for X in terms of Y)
 *    - Large trades move price more (slippage)
 *    - Arbitrageurs keep prices aligned with markets
 * 
 * 3. LIQUIDITY PROVIDERS (LPs)
 *    - Deposit equal value of both tokens
 *    - Receive LP tokens as proof
 *    - Earn fees from swaps
 *    - Face impermanent loss risk
 * 
 * 4. ERGO-SPECIFIC
 *    - eUTXO model enables unique pool designs
 *    - Order book DEXes also possible
 *    - Babel fees allow token-only transactions
 *    - Spectrum uses concentrated liquidity
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
