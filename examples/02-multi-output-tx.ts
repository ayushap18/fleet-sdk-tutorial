/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚔️ QUEST: Multi-Output Transaction
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 Objective: Send ERG to multiple recipients in a single transaction
 * 📋 Prerequisites: Completed basic transfer example
 * ⏱️ Completion Time: ~10 minutes
 * ⭐ Difficulty: Easy-Medium
 * 
 * 🏆 Rewards Upon Completion:
 * - Understanding of multi-output transactions
 * - Efficient batch payment skills
 * - Gas optimization knowledge
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { 
  TransactionBuilder, 
  OutputBuilder,
  RECOMMENDED_MIN_FEE_VALUE,
  type Box
} from "@fleet-sdk/core";

// ════════════════════════════════════════
// 📦 CONFIGURATION
// ════════════════════════════════════════

interface Recipient {
  address: string;
  amount: bigint;
  label: string;
}

const CONFIG = {
  /** Multiple recipients for this transaction */
  recipients: [
    {
      address: "9fRAWhdxEsTcdb8PhGNrZfwqa65zfkuYHAMmkQLcic1gdLSV5vA",
      amount: 100_000_000n,  // 0.1 ERG
      label: "Alice"
    },
    {
      address: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
      amount: 200_000_000n,  // 0.2 ERG
      label: "Bob"
    },
    {
      address: "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ",
      amount: 150_000_000n,  // 0.15 ERG
      label: "Charlie"
    },
    {
      address: "9fMPy1XY3GW4T6t3LjYofqmzER6x9cV21n5UVJTWmma4Y9mAW6c",
      amount: 50_000_000n,   // 0.05 ERG
      label: "Diana"
    }
  ] as Recipient[],
  
  /** Your address for receiving change */
  changeAddress: "9eZVqXVnrVWQKK19b7E7kp4ZyNqanp2z1mpKUJRaouNsme6qZXu",
  
  /** Current blockchain height */
  networkHeight: 1_200_000,
};

// ════════════════════════════════════════
// 🎮 MOCK INPUT DATA
// ════════════════════════════════════════

const mockInputBoxes: Box<bigint>[] = [
  {
    boxId: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    value: 2_000_000_000n,  // 2 ERG - enough for all recipients
    ergoTree: "0008cd0327e65711a59378c59359c3e1d0f7abe906479eccb76094e50fe79d743ccc15e6",
    creationHeight: 1_100_000,
    assets: [],
    additionalRegisters: {},
    transactionId: "abc123def456abc123def456abc123def456abc123def456abc123def456abc1",
    index: 0
  }
];

// ════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════

function formatErg(nanoErg: bigint): string {
  const erg = Number(nanoErg) / 1_000_000_000;
  return `${erg.toFixed(4)} ERG`;
}

function calculateTotalOutput(recipients: Recipient[]): bigint {
  return recipients.reduce((sum, r) => sum + r.amount, 0n);
}

// ════════════════════════════════════════
// 🎮 MAIN QUEST FUNCTION
// ════════════════════════════════════════

async function executeMultiOutputTransfer(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  QUEST: Multi-Output Transaction");
  console.log("═".repeat(60));
  console.log("\n");

  try {
    // ────────────────────────────────────
    // 📋 Display Recipients
    // ────────────────────────────────────
    console.log("👥 Recipients:");
    console.log("─".repeat(50));
    
    CONFIG.recipients.forEach((recipient, index) => {
      console.log(`   [${index + 1}] ${recipient.label}`);
      console.log(`       Address: ${recipient.address.slice(0, 20)}...`);
      console.log(`       Amount:  ${formatErg(recipient.amount)}`);
    });
    
    const totalToSend = calculateTotalOutput(CONFIG.recipients);
    console.log("─".repeat(50));
    console.log(`   💰 Total: ${formatErg(totalToSend)}`);
    console.log("");

    // ────────────────────────────────────
    // 📦 Validate Inputs
    // ────────────────────────────────────
    console.log("📦 Checking available funds...");
    
    const totalInput = mockInputBoxes.reduce((sum, box) => sum + box.value, 0n);
    const totalRequired = totalToSend + RECOMMENDED_MIN_FEE_VALUE;
    
    console.log(`   ├─ Available:  ${formatErg(totalInput)}`);
    console.log(`   ├─ Required:   ${formatErg(totalRequired)}`);
    console.log(`   └─ Fee:        ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
    
    if (totalInput < totalRequired) {
      throw new Error(`Insufficient funds! Need ${formatErg(totalRequired)}`);
    }
    console.log("   ✓ Funds verified!\n");

    // ────────────────────────────────────
    // 📤 Create All Outputs
    // ────────────────────────────────────
    console.log("📤 Creating outputs for all recipients...");
    
    const outputs = CONFIG.recipients.map((recipient, index) => {
      console.log(`   [${index + 1}] Creating output for ${recipient.label}...`);
      return new OutputBuilder(recipient.amount, recipient.address);
    });
    
    console.log("   ✓ All outputs created!\n");

    // ────────────────────────────────────
    // 🔨 Build Transaction
    // ────────────────────────────────────
    console.log("🔨 Building multi-output transaction...");
    
    // Method 1: Add outputs one by one
    let txBuilder = new TransactionBuilder(CONFIG.networkHeight)
      .from(mockInputBoxes);
    
    // Add each output
    for (const output of outputs) {
      txBuilder = txBuilder.to(output);
    }
    
    const unsignedTx = txBuilder
      .sendChangeTo(CONFIG.changeAddress)
      .payFee(RECOMMENDED_MIN_FEE_VALUE)
      .build();

    console.log(`   ├─ Inputs:  ${unsignedTx.inputs.length}`);
    console.log(`   ├─ Outputs: ${unsignedTx.outputs.length} (${CONFIG.recipients.length} recipients + 1 change)`);
    console.log(`   └─ ✓ Transaction built!\n`);

    // ────────────────────────────────────
    // 📊 Transaction Summary
    // ────────────────────────────────────
    console.log("📊 Transaction Summary");
    console.log("═".repeat(50));
    
    console.log("\n   📥 INPUTS:");
    mockInputBoxes.forEach((box, i) => {
      console.log(`      [${i}] ${formatErg(box.value)}`);
    });
    
    console.log("\n   📤 OUTPUTS:");
    CONFIG.recipients.forEach((recipient, i) => {
      console.log(`      [${i}] ${recipient.label}: ${formatErg(recipient.amount)}`);
    });
    
    const changeAmount = totalInput - totalToSend - RECOMMENDED_MIN_FEE_VALUE;
    console.log(`      [${CONFIG.recipients.length}] Change: ${formatErg(changeAmount)}`);
    
    console.log(`\n   ⛽ FEE: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
    console.log("\n" + "═".repeat(50));

    // ────────────────────────────────────
    // 💡 Efficiency Note
    // ────────────────────────────────────
    console.log("\n💡 Why Multi-Output?");
    console.log("─".repeat(50));
    console.log("   • Single transaction fee instead of 4 separate fees");
    console.log("   • One confirmation for all payments");
    console.log("   • Atomic: all succeed or all fail");
    console.log("   • Saves blockchain space\n");

    // ────────────────────────────────────
    // 🏆 Quest Complete!
    // ────────────────────────────────────
    console.log("🏆 QUEST COMPLETE!");
    console.log("   Achievement Unlocked: Batch Payment Master\n");

  } catch (error) {
    console.error("\n❌ QUEST FAILED!");
    console.error(`   Error: ${(error as Error).message}\n`);
    throw error;
  }
}

// ════════════════════════════════════════
// 🎬 EXECUTE QUEST
// ════════════════════════════════════════

executeMultiOutputTransfer()
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
 * Multi-output transactions are efficient for:
 * 
 * 1. BATCH PAYMENTS
 *    - Pay multiple employees/contractors at once
 *    - Distribute rewards to multiple winners
 *    - Airdrop tokens to many addresses
 * 
 * 2. ATOMIC OPERATIONS
 *    - All outputs are created in one transaction
 *    - If one fails, none are created
 *    - Great for consistency
 * 
 * 3. FEE SAVINGS
 *    - One fee covers all outputs
 *    - Much cheaper than separate transactions
 *    - Example: 4 outputs for ~0.001 ERG vs 4 × 0.001 = 0.004 ERG
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
