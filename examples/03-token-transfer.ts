/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚔️ QUEST: Token Transfer
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 Objective: Transfer native tokens along with ERG
 * 📋 Prerequisites: Understanding of UTXO model
 * ⏱️ Completion Time: ~15 minutes
 * ⭐ Difficulty: Medium
 * 
 * 🏆 Rewards Upon Completion:
 * - Understanding of native tokens on Ergo
 * - Token transfer mechanics
 * - Multi-asset transaction building
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
// 📦 CONFIGURATION
// ════════════════════════════════════════

const CONFIG = {
  /** The token we're transferring */
  token: {
    /** Token ID (64 hex characters) */
    id: "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
    /** Amount to transfer */
    amount: 100n,
    /** Token name (for display) */
    name: "SigUSD"
  },
  
  /** Recipient address */
  recipientAddress: "9fRAWhdxEsTcdb8PhGNrZfwqa65zfkuYHAMmkQLcic1gdLSV5vA",
  
  /** Change address */
  changeAddress: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
  
  /** Current blockchain height */
  networkHeight: 1_200_000,
};

// ════════════════════════════════════════
// 🎮 MOCK INPUT DATA
// ════════════════════════════════════════

/**
 * Input box containing both ERG and tokens
 */
const mockInputBoxes: Box<bigint>[] = [
  {
    boxId: "token-input-box-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    value: 1_000_000_000n,  // 1 ERG
    ergoTree: "0008cd0327e65711a59378c59359c3e1d0f7abe906479eccb76094e50fe79d743ccc15e6",
    creationHeight: 1_100_000,
    assets: [
      {
        tokenId: CONFIG.token.id,
        amount: 500n  // We have 500 tokens total
      },
      {
        // Another token in the same box
        tokenId: "0cd8c9f416e5b1ca9f986a7f10a84191dfb85941619e49e53c0dc30ebf83324b",
        amount: 1000n
      }
    ],
    additionalRegisters: {},
    transactionId: "prev-tx-id-abc123",
    index: 0
  }
];

// ════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════

function formatErg(nanoErg: bigint): string {
  return `${(Number(nanoErg) / 1_000_000_000).toFixed(4)} ERG`;
}

function formatTokens(assets: TokenAmount<bigint>[]): void {
  assets.forEach(asset => {
    const shortId = `${asset.tokenId.slice(0, 8)}...${asset.tokenId.slice(-8)}`;
    console.log(`      └─ Token: ${shortId} × ${asset.amount}`);
  });
}

function getTokenName(tokenId: string): string {
  if (tokenId === CONFIG.token.id) return CONFIG.token.name;
  return "Unknown Token";
}

// ════════════════════════════════════════
// 🎮 MAIN QUEST FUNCTION
// ════════════════════════════════════════

async function executeTokenTransfer(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  QUEST: Token Transfer");
  console.log("═".repeat(60));
  console.log("\n");

  try {
    // ────────────────────────────────────
    // 📦 Analyze Input Boxes
    // ────────────────────────────────────
    console.log("📦 Analyzing input boxes...");
    
    mockInputBoxes.forEach((box, i) => {
      console.log(`   [${i}] Box: ${box.boxId.slice(0, 16)}...`);
      console.log(`      └─ Value: ${formatErg(box.value)}`);
      if (box.assets.length > 0) {
        console.log(`      └─ Tokens:`);
        box.assets.forEach(asset => {
          const name = getTokenName(asset.tokenId);
          console.log(`         • ${name}: ${asset.amount}`);
        });
      }
    });
    console.log("");

    // ────────────────────────────────────
    // ✅ Verify Token Availability
    // ────────────────────────────────────
    console.log("✅ Verifying token availability...");
    
    const availableTokens = mockInputBoxes.reduce((sum, box) => {
      const token = box.assets.find(a => a.tokenId === CONFIG.token.id);
      return sum + (token?.amount ?? 0n);
    }, 0n);
    
    console.log(`   ├─ Token: ${CONFIG.token.name}`);
    console.log(`   ├─ Available: ${availableTokens}`);
    console.log(`   ├─ Sending:   ${CONFIG.token.amount}`);
    console.log(`   └─ Remaining: ${availableTokens - CONFIG.token.amount}`);
    
    if (availableTokens < CONFIG.token.amount) {
      throw new Error(`Insufficient tokens! Have ${availableTokens}, need ${CONFIG.token.amount}`);
    }
    console.log("   ✓ Tokens verified!\n");

    // ────────────────────────────────────
    // 📤 Create Token Output
    // ────────────────────────────────────
    console.log("📤 Creating output with tokens...");
    
    /**
     * IMPORTANT: When sending tokens, you MUST also send some ERG!
     * Use SAFE_MIN_BOX_VALUE as the minimum amount.
     */
    const recipientOutput = new OutputBuilder(
      SAFE_MIN_BOX_VALUE,  // Minimum ERG for the box
      CONFIG.recipientAddress
    ).addTokens({
      tokenId: CONFIG.token.id,
      amount: CONFIG.token.amount
    });
    
    console.log(`   ├─ Recipient: ${CONFIG.recipientAddress.slice(0, 20)}...`);
    console.log(`   ├─ ERG:       ${formatErg(SAFE_MIN_BOX_VALUE)} (minimum)`);
    console.log(`   └─ Tokens:    ${CONFIG.token.amount} ${CONFIG.token.name}`);
    console.log("");

    // ────────────────────────────────────
    // 🔨 Build Transaction
    // ────────────────────────────────────
    console.log("🔨 Building token transfer transaction...");
    
    const unsignedTx = new TransactionBuilder(CONFIG.networkHeight)
      .from(mockInputBoxes)
      .to(recipientOutput)
      .sendChangeTo(CONFIG.changeAddress)
      .payFee(RECOMMENDED_MIN_FEE_VALUE)
      .build();
    
    console.log(`   ├─ Inputs:  ${unsignedTx.inputs.length}`);
    console.log(`   ├─ Outputs: ${unsignedTx.outputs.length}`);
    console.log(`   └─ ✓ Transaction built!\n`);

    // ────────────────────────────────────
    // 📊 Transaction Summary
    // ────────────────────────────────────
    console.log("📊 Transaction Summary");
    console.log("═".repeat(50));
    
    console.log("\n   📥 INPUTS (consumed):");
    mockInputBoxes.forEach((box, i) => {
      console.log(`      [${i}] ${formatErg(box.value)}`);
      box.assets.forEach(asset => {
        const name = getTokenName(asset.tokenId);
        console.log(`          + ${asset.amount} ${name}`);
      });
    });
    
    console.log("\n   📤 OUTPUTS (created):");
    console.log(`      [0] Recipient: ${formatErg(SAFE_MIN_BOX_VALUE)}`);
    console.log(`          + ${CONFIG.token.amount} ${CONFIG.token.name}`);
    
    // Calculate change
    const inputValue = mockInputBoxes.reduce((s, b) => s + b.value, 0n);
    const changeValue = inputValue - SAFE_MIN_BOX_VALUE - RECOMMENDED_MIN_FEE_VALUE;
    const remainingTokens = availableTokens - CONFIG.token.amount;
    
    console.log(`      [1] Change: ${formatErg(changeValue)}`);
    console.log(`          + ${remainingTokens} ${CONFIG.token.name}`);
    
    // Show other tokens going to change
    const otherTokens = mockInputBoxes
      .flatMap(b => b.assets)
      .filter(a => a.tokenId !== CONFIG.token.id);
    
    otherTokens.forEach(token => {
      console.log(`          + ${token.amount} (other token)`);
    });
    
    console.log(`\n   ⛽ FEE: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
    console.log("\n" + "═".repeat(50));

    // ────────────────────────────────────
    // 💡 Important Notes
    // ────────────────────────────────────
    console.log("\n💡 Important Token Transfer Notes:");
    console.log("─".repeat(50));
    console.log("   • Tokens MUST be accompanied by ERG (min box value)");
    console.log("   • Unused tokens automatically go to change address");
    console.log("   • Multiple token types can be in one box");
    console.log("   • Token ID = First input box ID when minted\n");

    // ────────────────────────────────────
    // 🏆 Quest Complete!
    // ────────────────────────────────────
    console.log("🏆 QUEST COMPLETE!");
    console.log("   Achievement Unlocked: Token Trader\n");

  } catch (error) {
    console.error("\n❌ QUEST FAILED!");
    console.error(`   Error: ${(error as Error).message}\n`);
    throw error;
  }
}

// ════════════════════════════════════════
// 🎬 EXECUTE QUEST
// ════════════════════════════════════════

executeTokenTransfer()
  .then(() => {
    console.log("✨ Example completed successfully!\n");
  })
  .catch((err) => {
    console.error("💀 Fatal error:", err.message);
    process.exit(1);
  });

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 LORE: Ergo Token Model
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Ergo has NATIVE tokens, meaning:
 * 
 * 1. FIRST-CLASS CITIZENS
 *    - Not smart contracts (unlike ERC-20)
 *    - Built into the protocol
 *    - Very efficient and cheap
 * 
 * 2. TOKEN PROPERTIES
 *    - ID: 64-character hex string (from minting box ID)
 *    - Amount: BigInt (can be 1 for NFTs or billions for fungible)
 *    - Name/Description: Stored in registers at mint time
 * 
 * 3. TRANSFER RULES
 *    - Tokens always need a "carrier" box with ERG
 *    - Minimum ERG value (SAFE_MIN_BOX_VALUE) required
 *    - Multiple tokens can share one box
 * 
 * 4. CHANGE HANDLING
 *    - Unused tokens automatically go to change output
 *    - No explicit token burning in this example
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
