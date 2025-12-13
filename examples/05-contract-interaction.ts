/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚔️ QUEST: Smart Contract Interaction
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 Objective: Compile ErgoScript and interact with smart contracts
 * 📋 Prerequisites: Understanding of transactions and boxes
 * ⏱️ Completion Time: ~25 minutes
 * ⭐ Difficulty: Hard
 * 
 * 🏆 Rewards Upon Completion:
 * - Understanding of ErgoScript compilation
 * - Knowledge of P2S (Pay-to-Script) addresses
 * - Ability to lock and unlock funds with conditions
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

// Note: In production, import from @fleet-sdk/compiler
// import { compile } from "@fleet-sdk/compiler";

// ════════════════════════════════════════
// 📜 ERGOSCRIPT CONTRACTS
// ════════════════════════════════════════

/**
 * Contract 1: Time-Lock
 * Funds can only be spent after a specific block height
 */
const TIME_LOCK_SCRIPT = `
{
  // Funds locked until block 1,500,000
  val unlockHeight = 1500000L
  
  // Owner's public key
  val ownerPk = PK("9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v")
  
  // Can spend if: height reached AND owner signs
  sigmaProp(HEIGHT >= unlockHeight && ownerPk)
}
`;

/**
 * Contract 2: Simple Threshold
 * Anyone can spend if they send enough ERG to a recipient
 */
const THRESHOLD_SCRIPT = `
{
  // Minimum amount required: 1 ERG
  val minAmount = 1000000000L
  
  // Recipient address
  val recipientPk = PK("9fRAWhdxEsTcdb8PhGNrZfwqa65zfkuYHAMmkQLcic1gdLSV5vA")
  
  // Check first output goes to recipient with enough value
  val correctOutput = OUTPUTS(0).value >= minAmount && 
                      OUTPUTS(0).propositionBytes == recipientPk.propBytes
  
  sigmaProp(correctOutput)
}
`;

/**
 * Contract 3: Password Protected (Hash Lock)
 * Funds released when correct preimage is provided
 */
const HASH_LOCK_SCRIPT = `
{
  // SHA256 hash of the secret password
  val secretHash = fromBase16("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855")
  
  // The spender must provide the preimage in R4
  val preimage = SELF.R4[Coll[Byte]].get
  
  // Verify hash matches
  val hashMatches = sha256(preimage) == secretHash
  
  sigmaProp(hashMatches)
}
`;

// ════════════════════════════════════════
// 📦 CONFIGURATION
// ════════════════════════════════════════

const CONFIG = {
  /** Amount to lock in contract */
  lockAmount: 1_000_000_000n,  // 1 ERG
  
  /** Owner address */
  ownerAddress: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
  
  /** Change address */
  changeAddress: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
  
  /** Current height */
  currentHeight: 1_200_000,
  
  /** Unlock height for time-lock */
  unlockHeight: 1_500_000,
};

// ════════════════════════════════════════
// 🎮 MOCK DATA
// ════════════════════════════════════════

const mockInputBoxes: Box<bigint>[] = [
  {
    boxId: "contract-input-1a2b3c4d5e6f",
    value: 5_000_000_000n,  // 5 ERG
    ergoTree: "0008cd0327e65711a59378c59359c3e1d0f7abe906479eccb76094e50fe79d743ccc15e6",
    creationHeight: 1_100_000,
    assets: [],
    additionalRegisters: {},
    transactionId: "prev-tx-contract",
    index: 0
  }
];

// Mock compiled contract (in production, use @fleet-sdk/compiler)
const mockCompiledContract = {
  ergoTree: "100204a00b08cd0327e65711a59378c59359c3e1d0f7abe906479eccb76094e50fe79d743ccc15e6d1aea4d9010163",
  address: "2Z4YBkDsDvQj8BX7xiySFewjitqp2ge9z7W6q5jHPQW3osP7Cw9bY6BLZu8K",
};

// ════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════

function formatErg(nanoErg: bigint): string {
  return `${(Number(nanoErg) / 1_000_000_000).toFixed(4)} ERG`;
}

/**
 * Mock compile function
 * In production, use: import { compile } from "@fleet-sdk/compiler";
 */
function mockCompile(script: string): typeof mockCompiledContract {
  console.log("   📜 Parsing ErgoScript...");
  console.log("   🔨 Generating ErgoTree...");
  console.log("   📍 Deriving P2S address...");
  return mockCompiledContract;
}

// ════════════════════════════════════════
// 🎮 MAIN QUEST FUNCTIONS
// ════════════════════════════════════════

/**
 * Part 1: Compile contract and lock funds
 */
async function lockFundsInContract(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  QUEST PART 1: Lock Funds in Contract");
  console.log("═".repeat(60));
  console.log("\n");

  try {
    // ────────────────────────────────────
    // 📜 Step 1: Compile ErgoScript
    // ────────────────────────────────────
    console.log("📜 STEP 1: Compiling ErgoScript contract...\n");
    
    console.log("   Contract Source:");
    console.log("   ┌────────────────────────────────────────┐");
    TIME_LOCK_SCRIPT.split('\n').forEach(line => {
      if (line.trim()) console.log(`   │ ${line}`);
    });
    console.log("   └────────────────────────────────────────┘\n");

    const compiled = mockCompile(TIME_LOCK_SCRIPT);
    
    console.log(`   ✓ ErgoTree: ${compiled.ergoTree.slice(0, 32)}...`);
    console.log(`   ✓ P2S Address: ${compiled.address.slice(0, 24)}...`);
    console.log("");

    // ────────────────────────────────────
    // 📦 Step 2: Prepare Lock Transaction
    // ────────────────────────────────────
    console.log("📦 STEP 2: Preparing lock transaction...");
    
    const inputValue = mockInputBoxes.reduce((s, b) => s + b.value, 0n);
    console.log(`   ├─ Available: ${formatErg(inputValue)}`);
    console.log(`   ├─ Locking:   ${formatErg(CONFIG.lockAmount)}`);
    console.log(`   └─ To Contract: ${compiled.address.slice(0, 20)}...\n`);

    // ────────────────────────────────────
    // 🔒 Step 3: Create Contract Output
    // ────────────────────────────────────
    console.log("🔒 STEP 3: Creating contract output box...");
    
    /**
     * When locking funds in a contract:
     * - Send to the P2S (Pay-to-Script) address
     * - The address is derived from the ErgoTree
     * - Anyone can see the funds, but only valid spending conditions unlock them
     */
    const contractOutput = new OutputBuilder(
      CONFIG.lockAmount,
      compiled.address  // P2S address
    );
    
    console.log(`   ├─ Value: ${formatErg(CONFIG.lockAmount)}`);
    console.log(`   ├─ Script: Time-lock until height ${CONFIG.unlockHeight}`);
    console.log(`   └─ Owner: ${CONFIG.ownerAddress.slice(0, 20)}...\n`);

    // ────────────────────────────────────
    // 🔨 Step 4: Build Lock Transaction
    // ────────────────────────────────────
    console.log("🔨 STEP 4: Building lock transaction...");
    
    const lockTx = new TransactionBuilder(CONFIG.currentHeight)
      .from(mockInputBoxes)
      .to(contractOutput)
      .sendChangeTo(CONFIG.changeAddress)
      .payFee(RECOMMENDED_MIN_FEE_VALUE)
      .build();
    
    console.log(`   ├─ Inputs:  ${lockTx.inputs.length}`);
    console.log(`   ├─ Outputs: ${lockTx.outputs.length}`);
    console.log(`   └─ ✓ Lock transaction built!\n`);

    // ────────────────────────────────────
    // 📊 Summary
    // ────────────────────────────────────
    console.log("📊 Lock Transaction Summary");
    console.log("═".repeat(50));
    console.log(`\n   🔓 UNLOCKS AT: Block ${CONFIG.unlockHeight}`);
    console.log(`   📅 Current:    Block ${CONFIG.currentHeight}`);
    console.log(`   ⏳ Remaining:  ${CONFIG.unlockHeight - CONFIG.currentHeight} blocks\n`);
    
    const changeAmount = inputValue - CONFIG.lockAmount - RECOMMENDED_MIN_FEE_VALUE;
    console.log("   📤 Outputs:");
    console.log(`      [0] Contract: ${formatErg(CONFIG.lockAmount)} (LOCKED)`);
    console.log(`      [1] Change:   ${formatErg(changeAmount)}`);
    console.log(`\n   ⛽ Fee: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
    console.log("\n" + "═".repeat(50));

    console.log("\n🏆 PART 1 COMPLETE!");
    console.log("   Funds are now locked in the contract!\n");

  } catch (error) {
    console.error("\n❌ Lock failed:", (error as Error).message);
    throw error;
  }
}

/**
 * Part 2: Spend from contract (after conditions met)
 */
async function spendFromContract(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  QUEST PART 2: Spend from Contract");
  console.log("═".repeat(60));
  console.log("\n");

  try {
    // ────────────────────────────────────
    // 📦 Step 1: Find Contract Box
    // ────────────────────────────────────
    console.log("📦 STEP 1: Finding contract box to spend...");
    
    // In production, fetch this from the blockchain
    const contractBox: Box<bigint> = {
      boxId: "contract-box-locked-funds",
      value: CONFIG.lockAmount,
      ergoTree: mockCompiledContract.ergoTree,
      creationHeight: CONFIG.currentHeight + 1,
      assets: [],
      additionalRegisters: {},
      transactionId: "lock-tx-id",
      index: 0
    };
    
    console.log(`   ├─ Box ID: ${contractBox.boxId.slice(0, 24)}...`);
    console.log(`   ├─ Value: ${formatErg(contractBox.value)}`);
    console.log(`   └─ Contract: Time-lock\n`);

    // ────────────────────────────────────
    // ✅ Step 2: Verify Conditions
    // ────────────────────────────────────
    console.log("✅ STEP 2: Verifying spending conditions...");
    
    // Simulate being at unlock height
    const spendHeight = CONFIG.unlockHeight + 100;
    
    console.log(`   ├─ Required Height: ${CONFIG.unlockHeight}`);
    console.log(`   ├─ Current Height:  ${spendHeight}`);
    console.log(`   └─ Condition Met:   ✓ HEIGHT >= unlockHeight\n`);

    // ────────────────────────────────────
    // 🔓 Step 3: Build Spend Transaction
    // ────────────────────────────────────
    console.log("🔓 STEP 3: Building spend transaction...");
    
    /**
     * When spending from a contract:
     * - Use the contract box as input
     * - The blockchain verifies the ErgoScript conditions
     * - If conditions pass, the spend is valid
     */
    const spendTx = new TransactionBuilder(spendHeight)
      .from([contractBox])
      .to(
        new OutputBuilder(
          contractBox.value - RECOMMENDED_MIN_FEE_VALUE,
          CONFIG.ownerAddress
        )
      )
      .payFee(RECOMMENDED_MIN_FEE_VALUE)
      .build();
    
    console.log(`   ├─ Inputs:  ${spendTx.inputs.length} (contract box)`);
    console.log(`   ├─ Outputs: ${spendTx.outputs.length}`);
    console.log(`   └─ ✓ Spend transaction built!\n`);

    // ────────────────────────────────────
    // 📊 Summary
    // ────────────────────────────────────
    console.log("📊 Spend Transaction Summary");
    console.log("═".repeat(50));
    
    console.log("\n   📥 Input (Contract Box):");
    console.log(`      Value: ${formatErg(contractBox.value)}`);
    console.log(`      Script: Time-lock (SATISFIED)`);
    
    console.log("\n   📤 Output:");
    console.log(`      To: ${CONFIG.ownerAddress.slice(0, 24)}...`);
    console.log(`      Value: ${formatErg(contractBox.value - RECOMMENDED_MIN_FEE_VALUE)}`);
    
    console.log(`\n   ⛽ Fee: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
    console.log("\n" + "═".repeat(50));

    console.log("\n🏆 PART 2 COMPLETE!");
    console.log("   Funds successfully unlocked from contract!\n");

  } catch (error) {
    console.error("\n❌ Spend failed:", (error as Error).message);
    throw error;
  }
}

/**
 * Part 3: Show contract examples
 */
function showContractExamples(): void {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("📚 Contract Pattern Reference");
  console.log("═".repeat(60));
  console.log("\n");

  console.log("🔒 Pattern 1: TIME-LOCK");
  console.log("─".repeat(40));
  console.log("   Use Case: Vesting, delayed payments");
  console.log("   Condition: HEIGHT >= unlockHeight");
  console.log("");

  console.log("🎯 Pattern 2: THRESHOLD");
  console.log("─".repeat(40));
  console.log("   Use Case: Crowdfunding, escrow");
  console.log("   Condition: Output meets requirements");
  console.log("");

  console.log("🔐 Pattern 3: HASH-LOCK");
  console.log("─".repeat(40));
  console.log("   Use Case: Atomic swaps, password protection");
  console.log("   Condition: sha256(preimage) == hash");
  console.log("");

  console.log("👥 Pattern 4: MULTI-SIG");
  console.log("─".repeat(40));
  console.log("   Use Case: Team wallets, shared custody");
  console.log("   Condition: atLeast(2, Coll(pk1, pk2, pk3))");
  console.log("");
}

// ════════════════════════════════════════
// 🎬 EXECUTE QUEST
// ════════════════════════════════════════

async function main() {
  try {
    await lockFundsInContract();
    await spendFromContract();
    showContractExamples();
    
    console.log("🏆 QUEST COMPLETE!");
    console.log("   Achievement Unlocked: Contract Master\n");
    console.log("✨ Example completed successfully!\n");
    
  } catch (err) {
    console.error("💀 Fatal error:", (err as Error).message);
    process.exit(1);
  }
}

main();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 LORE: ErgoScript & Contracts
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ErgoScript is Ergo's smart contract language:
 * 
 * 1. DECLARATIVE STYLE
 *    - Describes conditions for spending
 *    - Not procedural like Solidity
 *    - "Can this be spent?" not "How to spend"
 * 
 * 2. SIGMA PROTOCOLS
 *    - Based on cryptographic proofs
 *    - sigmaProp() wraps spending conditions
 *    - Supports complex multi-party schemes
 * 
 * 3. CONTEXT VARIABLES
 *    - HEIGHT: Current blockchain height
 *    - SELF: The box being spent
 *    - INPUTS: All transaction inputs
 *    - OUTPUTS: All transaction outputs
 * 
 * 4. COMPILATION
 *    - ErgoScript → ErgoTree (binary)
 *    - ErgoTree → P2S Address (for deposits)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
