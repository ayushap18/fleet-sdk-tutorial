/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚔️ QUEST: Simple ERG Transfer
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 Objective: Transfer ERG from one address to another
 * 📋 Prerequisites: Funded testnet wallet
 * ⏱️ Completion Time: ~5 minutes
 * ⭐ Difficulty: Easy
 * 
 * 🏆 Rewards Upon Completion:
 * - Understanding of UTXO transactions
 * - Experience with Fleet SDK TransactionBuilder
 * - Knowledge of fee calculation
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
// 📦 CONFIGURATION
// ════════════════════════════════════════

const CONFIG = {
  /** Recipient's Ergo address (testnet format) */
  recipientAddress: "9fRAWhdxEsTcdb8PhGNrZfwqa65zfkuYHAMmkQLcic1gdLSV5vA",
  
  /** Amount to send in nanoERG (0.1 ERG = 100,000,000 nanoERG) */
  amountToSend: 100_000_000n,
  
  /** Your address for receiving change */
  changeAddress: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
  
  /** Current blockchain height (fetch from explorer in production) */
  networkHeight: 1_200_000,
};

// ════════════════════════════════════════
// 🎮 MOCK INPUT DATA
// ════════════════════════════════════════

/**
 * Mock input box representing a UTXO in your wallet.
 * 
 * In production, you would fetch this from:
 * - Nautilus wallet API
 * - Ergo Explorer API
 * - Your own node
 */
const mockInputBoxes: Box<bigint>[] = [
  {
    boxId: "8b7765e4b7dbc00e0e1c0e1c3c5c6c7c8c9cacbcccdcecfc0c1c2c3c4c5c6c7c8",
    value: 1_000_000_000n,  // 1 ERG
    ergoTree: "0008cd0327e65711a59378c59359c3e1d0f7abe906479eccb76094e50fe79d743ccc15e6",
    creationHeight: 1_100_000,
    assets: [],  // No tokens in this box
    additionalRegisters: {},
    transactionId: "9c8b7a6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    index: 0
  }
];

// ════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════

/**
 * Calculates total value of input boxes
 */
function calculateTotalInput(boxes: Box<bigint>[]): bigint {
  return boxes.reduce((sum, box) => sum + box.value, 0n);
}

/**
 * Formats nanoERG to ERG string
 */
function formatErg(nanoErg: bigint): string {
  const erg = Number(nanoErg) / 1_000_000_000;
  return `${erg.toFixed(9)} ERG`;
}

/**
 * Validates that we have sufficient funds
 */
function validateFunds(
  available: bigint, 
  required: bigint
): void {
  if (available < required) {
    throw new Error(
      `Insufficient funds! Need ${formatErg(required)}, have ${formatErg(available)}`
    );
  }
}

// ════════════════════════════════════════
// 🎮 MAIN QUEST FUNCTION
// ════════════════════════════════════════

async function executeBasicTransfer(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  QUEST: Simple ERG Transfer");
  console.log("═".repeat(60));
  console.log("\n");

  try {
    // ────────────────────────────────────
    // 📦 STEP 1: Gather Resources (Inputs)
    // ────────────────────────────────────
    console.log("📦 STEP 1: Gathering input boxes...");
    
    const inputs = mockInputBoxes;
    const totalInput = calculateTotalInput(inputs);
    
    console.log(`   ├─ Found ${inputs.length} input box(es)`);
    console.log(`   ├─ Total available: ${formatErg(totalInput)}`);
    console.log(`   └─ Box ID: ${inputs[0].boxId.slice(0, 16)}...`);
    console.log("");

    // ────────────────────────────────────
    // ✅ STEP 2: Validate Funds
    // ────────────────────────────────────
    console.log("✅ STEP 2: Validating sufficient funds...");
    
    const requiredAmount = CONFIG.amountToSend + RECOMMENDED_MIN_FEE_VALUE;
    validateFunds(totalInput, requiredAmount);
    
    console.log(`   ├─ Amount to send: ${formatErg(CONFIG.amountToSend)}`);
    console.log(`   ├─ Network fee:    ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
    console.log(`   ├─ Total required: ${formatErg(requiredAmount)}`);
    console.log(`   └─ ✓ Funds verified!`);
    console.log("");

    // ────────────────────────────────────
    // 📤 STEP 3: Create Output
    // ────────────────────────────────────
    console.log("📤 STEP 3: Creating output for recipient...");
    
    const recipientOutput = new OutputBuilder(
      CONFIG.amountToSend,
      CONFIG.recipientAddress
    );
    
    console.log(`   ├─ Recipient: ${CONFIG.recipientAddress.slice(0, 24)}...`);
    console.log(`   └─ Amount:    ${formatErg(CONFIG.amountToSend)}`);
    console.log("");

    // ────────────────────────────────────
    // 🔨 STEP 4: Build Transaction
    // ────────────────────────────────────
    console.log("🔨 STEP 4: Building transaction...");
    
    const unsignedTx = new TransactionBuilder(CONFIG.networkHeight)
      .from(inputs)
      .to(recipientOutput)
      .sendChangeTo(CONFIG.changeAddress)
      .payFee(RECOMMENDED_MIN_FEE_VALUE)
      .build();
    
    console.log(`   ├─ Transaction created at height: ${CONFIG.networkHeight}`);
    console.log(`   ├─ Inputs:  ${unsignedTx.inputs.length}`);
    console.log(`   ├─ Outputs: ${unsignedTx.outputs.length}`);
    console.log(`   └─ ✓ Transaction built successfully!`);
    console.log("");

    // ────────────────────────────────────
    // 📊 STEP 5: Review Summary
    // ────────────────────────────────────
    console.log("📊 STEP 5: Transaction Summary");
    console.log("─".repeat(50));
    
    const changeAmount = totalInput - CONFIG.amountToSend - RECOMMENDED_MIN_FEE_VALUE;
    
    console.log("   INPUTS:");
    unsignedTx.inputs.forEach((input, i) => {
      const box = inputs.find(b => b.boxId === input.boxId);
      console.log(`   └─ [${i}] ${formatErg(box?.value ?? 0n)}`);
    });
    
    console.log("");
    console.log("   OUTPUTS:");
    console.log(`   ├─ [0] Recipient: ${formatErg(CONFIG.amountToSend)}`);
    console.log(`   └─ [1] Change:    ${formatErg(changeAmount)}`);
    
    console.log("");
    console.log(`   FEE: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
    console.log("─".repeat(50));
    console.log("");

    // ────────────────────────────────────
    // 🏆 Quest Complete!
    // ────────────────────────────────────
    console.log("🏆 QUEST COMPLETE!");
    console.log("   Achievement Unlocked: First Transfer");
    console.log("");
    console.log("📋 Next Steps:");
    console.log("   1. Sign the transaction with your wallet");
    console.log("   2. Submit to the Ergo network");
    console.log("   3. Wait for confirmation (~2 minutes)");
    console.log("");
    console.log("═".repeat(60));
    console.log("");

  } catch (error) {
    console.error("\n❌ QUEST FAILED!");
    console.error(`   Error: ${(error as Error).message}`);
    console.error("");
    throw error;
  }
}

// ════════════════════════════════════════
// 🎬 EXECUTE QUEST
// ════════════════════════════════════════

executeBasicTransfer()
  .then(() => {
    console.log("✨ Example completed successfully!\n");
  })
  .catch((err) => {
    console.error("💀 Fatal error:", err.message);
    process.exit(1);
  });

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 LORE (Documentation)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This example demonstrates the fundamental pattern of Ergo transactions:
 * 
 * 1. SELECT INPUT BOXES
 *    - Choose UTXOs from your wallet with sufficient value
 *    - These boxes will be consumed (spent) by the transaction
 * 
 * 2. CREATE OUTPUT BOXES
 *    - Define where the funds are going
 *    - Each output becomes a new UTXO on the blockchain
 * 
 * 3. HANDLE CHANGE
 *    - Any excess funds go back to your wallet
 *    - This is like getting change when paying with a $20 bill
 * 
 * 4. PAY NETWORK FEE
 *    - Miners receive a fee for including your transaction
 *    - RECOMMENDED_MIN_FEE_VALUE is typically sufficient
 * 
 * 5. BUILD & SIGN
 *    - TransactionBuilder creates the unsigned transaction
 *    - Your wallet signs it with your private key
 * 
 * 6. BROADCAST
 *    - Submit to a node or through your wallet
 *    - Wait for block confirmation
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎓 LEARNING OBJECTIVES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * After this example, you should understand:
 * - The UTXO transaction model
 * - How to use TransactionBuilder
 * - Input selection basics
 * - Change output handling
 * - Fee calculation
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 🚀 NEXT STEPS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Try these variations:
 * - Send to multiple recipients (02-multi-output-tx.ts)
 * - Include tokens in the transfer (03-token-transfer.ts)
 * - Mint a new NFT (04-nft-minting.ts)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
