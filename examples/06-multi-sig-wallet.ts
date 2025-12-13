/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚔️ QUEST: Multi-Signature Wallet
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 Objective: Create a wallet requiring multiple signatures to spend
 * 📋 Prerequisites: Understanding of contracts and signatures
 * ⏱️ Completion Time: ~20 minutes
 * ⭐ Difficulty: Hard
 * 
 * 🏆 Rewards Upon Completion:
 * - Understanding of threshold signatures
 * - Team wallet implementation skills
 * - Secure fund management knowledge
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
// 👥 MULTI-SIG CONFIGURATION
// ════════════════════════════════════════

/**
 * Multi-signature scheme: M-of-N
 * - N = Total signers
 * - M = Required signatures
 */
interface MultiSigConfig {
  /** Name for this wallet */
  name: string;
  /** Required signatures to spend */
  threshold: number;
  /** All authorized signers */
  signers: Signer[];
}

interface Signer {
  name: string;
  address: string;
  role: string;
}

const MULTI_SIG_CONFIG: MultiSigConfig = {
  name: "Team Treasury",
  threshold: 2,  // 2-of-3 multi-sig
  signers: [
    {
      name: "Alice",
      address: "9fRAWhdxEsTcdb8PhGNrZfwqa65zfkuYHAMmkQLcic1gdLSV5vA",
      role: "CEO"
    },
    {
      name: "Bob",
      address: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
      role: "CFO"
    },
    {
      name: "Charlie",
      address: "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ",
      role: "CTO"
    }
  ]
};

// ════════════════════════════════════════
// 📜 MULTI-SIG ERGOSCRIPT
// ════════════════════════════════════════

/**
 * 2-of-3 Multi-Signature Contract
 * 
 * This contract requires at least 2 out of 3 specified
 * public keys to sign the spending transaction.
 */
const MULTI_SIG_SCRIPT = `
{
  // Define the three authorized public keys
  val pk1 = PK("9fRAWhdxEsTcdb8PhGNrZfwqa65zfkuYHAMmkQLcic1gdLSV5vA")  // Alice
  val pk2 = PK("9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v")  // Bob  
  val pk3 = PK("9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ")  // Charlie
  
  // Require at least 2 signatures out of 3
  sigmaProp(atLeast(2, Coll(pk1, pk2, pk3)))
}
`;

/**
 * Flexible M-of-N template
 */
const FLEXIBLE_MULTI_SIG = `
{
  // Dynamic threshold from R4 register
  val requiredSigs = SELF.R4[Int].get
  
  // Public keys stored in R5 as collection
  val authorizedKeys = SELF.R5[Coll[SigmaProp]].get
  
  // Verify threshold signatures
  sigmaProp(atLeast(requiredSigs, authorizedKeys))
}
`;

// ════════════════════════════════════════
// 📦 CONFIGURATION
// ════════════════════════════════════════

const CONFIG = {
  /** Treasury amount */
  treasuryAmount: 10_000_000_000n,  // 10 ERG
  
  /** Spending request amount */
  spendAmount: 2_000_000_000n,  // 2 ERG
  
  /** Recipient of withdrawal */
  recipientAddress: "9eZVqXVnrVWQKK19b7E7kp4ZyNqanp2z1mpKUJRaouNsme6qZXu",
  
  /** Current height */
  currentHeight: 1_200_000,
};

// ════════════════════════════════════════
// 🎮 MOCK DATA
// ════════════════════════════════════════

const mockInputBoxes: Box<bigint>[] = [
  {
    boxId: "funding-box-for-multisig",
    value: 15_000_000_000n,  // 15 ERG
    ergoTree: "0008cd0327e65711a59378c59359c3e1d0f7abe906479eccb76094e50fe79d743ccc15e6",
    creationHeight: 1_100_000,
    assets: [],
    additionalRegisters: {},
    transactionId: "funding-tx",
    index: 0
  }
];

const mockMultiSigContract = {
  ergoTree: "100604000402048092f401d193a37302cd0327e65711a59378c59359c3e1d0f7abe906479eccb76094e50fe79d743ccc15e6d801d601b2a4730000eb027301cd0296b3",
  address: "8UApt8czfFVQvhM1Q2YgGrBkNBgT8K3cBJEaVqfCQgz2C6HuT7M4",
};

// ════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════

function formatErg(nanoErg: bigint): string {
  return `${(Number(nanoErg) / 1_000_000_000).toFixed(4)} ERG`;
}

function displaySigners(config: MultiSigConfig): void {
  console.log(`   📋 ${config.name} (${config.threshold}-of-${config.signers.length})`);
  console.log("   ┌────────────────────────────────────────┐");
  config.signers.forEach((signer, i) => {
    console.log(`   │ ${i + 1}. ${signer.name.padEnd(10)} [${signer.role}]`);
    console.log(`   │    ${signer.address.slice(0, 24)}...`);
  });
  console.log("   └────────────────────────────────────────┘");
}

// ════════════════════════════════════════
// 🎮 MAIN QUEST FUNCTIONS
// ════════════════════════════════════════

/**
 * Step 1: Create Multi-Sig Wallet
 */
async function createMultiSigWallet(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 1: Create Multi-Sig Wallet");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 👥 Display Signer Configuration
  // ────────────────────────────────────
  console.log("👥 Multi-Sig Configuration:");
  displaySigners(MULTI_SIG_CONFIG);
  console.log("");

  // ────────────────────────────────────
  // 📜 Show Contract
  // ────────────────────────────────────
  console.log("📜 ErgoScript Contract:");
  console.log("─".repeat(50));
  console.log(`
   atLeast(${MULTI_SIG_CONFIG.threshold}, Coll(
     pk1,  // Alice (CEO)
     pk2,  // Bob (CFO)
     pk3   // Charlie (CTO)
   ))
  `);
  console.log("─".repeat(50));
  console.log("");

  // ────────────────────────────────────
  // 🔨 Compile Contract
  // ────────────────────────────────────
  console.log("🔨 Compiling multi-sig contract...");
  console.log(`   ├─ Type: ${MULTI_SIG_CONFIG.threshold}-of-${MULTI_SIG_CONFIG.signers.length}`);
  console.log(`   ├─ ErgoTree: ${mockMultiSigContract.ergoTree.slice(0, 32)}...`);
  console.log(`   └─ Address: ${mockMultiSigContract.address}`);
  console.log("");

  // ────────────────────────────────────
  // 💰 Fund the Wallet
  // ────────────────────────────────────
  console.log("💰 Funding multi-sig wallet...");
  
  const walletOutput = new OutputBuilder(
    CONFIG.treasuryAmount,
    mockMultiSigContract.address
  );
  
  const fundTx = new TransactionBuilder(CONFIG.currentHeight)
    .from(mockInputBoxes)
    .to(walletOutput)
    .sendChangeTo(MULTI_SIG_CONFIG.signers[0].address)
    .payFee(RECOMMENDED_MIN_FEE_VALUE)
    .build();
  
  console.log(`   ├─ Amount: ${formatErg(CONFIG.treasuryAmount)}`);
  console.log(`   ├─ Destination: Multi-sig wallet`);
  console.log(`   └─ ✓ Funding transaction built!`);
  console.log("");

  console.log("🏆 Multi-sig wallet created successfully!");
  console.log(`   Treasury Balance: ${formatErg(CONFIG.treasuryAmount)}\n`);
}

/**
 * Step 2: Propose a Withdrawal
 */
async function proposeWithdrawal(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 2: Propose Withdrawal");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 📝 Create Proposal
  // ────────────────────────────────────
  console.log("📝 Withdrawal Proposal:");
  console.log("─".repeat(50));
  console.log(`   Proposer:   ${MULTI_SIG_CONFIG.signers[0].name} (${MULTI_SIG_CONFIG.signers[0].role})`);
  console.log(`   Amount:     ${formatErg(CONFIG.spendAmount)}`);
  console.log(`   Recipient:  ${CONFIG.recipientAddress.slice(0, 24)}...`);
  console.log(`   Purpose:    Development expenses`);
  console.log("─".repeat(50));
  console.log("");

  // ────────────────────────────────────
  // ✅ Collect Signatures
  // ────────────────────────────────────
  console.log("✅ Signature Collection:");
  console.log("");
  
  const approvers = [
    { signer: MULTI_SIG_CONFIG.signers[0], approved: true },
    { signer: MULTI_SIG_CONFIG.signers[1], approved: true },
    { signer: MULTI_SIG_CONFIG.signers[2], approved: false },
  ];
  
  approvers.forEach((a, i) => {
    const status = a.approved ? "✓ APPROVED" : "✗ PENDING";
    const icon = a.approved ? "🟢" : "🔴";
    console.log(`   ${icon} ${a.signer.name} (${a.signer.role}): ${status}`);
  });
  
  const approvalCount = approvers.filter(a => a.approved).length;
  console.log("");
  console.log(`   Status: ${approvalCount}/${MULTI_SIG_CONFIG.threshold} signatures collected`);
  console.log(`   ${approvalCount >= MULTI_SIG_CONFIG.threshold ? "✓ THRESHOLD MET" : "⏳ Waiting for more signatures"}`);
  console.log("");
}

/**
 * Step 3: Execute Withdrawal
 */
async function executeWithdrawal(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  STEP 3: Execute Withdrawal");
  console.log("═".repeat(60));
  console.log("\n");

  // ────────────────────────────────────
  // 📦 Multi-Sig Box (Input)
  // ────────────────────────────────────
  console.log("📦 Multi-sig wallet box:");
  
  const multiSigBox: Box<bigint> = {
    boxId: "multisig-treasury-box",
    value: CONFIG.treasuryAmount,
    ergoTree: mockMultiSigContract.ergoTree,
    creationHeight: CONFIG.currentHeight + 1,
    assets: [],
    additionalRegisters: {},
    transactionId: "funding-tx-id",
    index: 0
  };
  
  console.log(`   ├─ Value: ${formatErg(multiSigBox.value)}`);
  console.log(`   └─ Contract: 2-of-3 multi-sig\n`);

  // ────────────────────────────────────
  // 🔨 Build Withdrawal Transaction
  // ────────────────────────────────────
  console.log("🔨 Building withdrawal transaction...");
  
  const remainingBalance = multiSigBox.value - CONFIG.spendAmount - RECOMMENDED_MIN_FEE_VALUE;
  
  // Output 1: Payment to recipient
  const paymentOutput = new OutputBuilder(
    CONFIG.spendAmount,
    CONFIG.recipientAddress
  );
  
  // Output 2: Remaining funds back to multi-sig
  const changeOutput = new OutputBuilder(
    remainingBalance,
    mockMultiSigContract.address
  );
  
  const withdrawTx = new TransactionBuilder(CONFIG.currentHeight)
    .from([multiSigBox])
    .to(paymentOutput)
    .to(changeOutput)
    .payFee(RECOMMENDED_MIN_FEE_VALUE)
    .build();
  
  console.log(`   ├─ Inputs: 1 (multi-sig box)`);
  console.log(`   ├─ Outputs: 2 (payment + remaining)`);
  console.log(`   └─ ✓ Withdrawal transaction built!\n`);

  // ────────────────────────────────────
  // 📊 Transaction Summary
  // ────────────────────────────────────
  console.log("📊 Withdrawal Transaction Summary");
  console.log("═".repeat(50));
  
  console.log("\n   📥 INPUT (Multi-Sig Box):");
  console.log(`      Value: ${formatErg(CONFIG.treasuryAmount)}`);
  console.log(`      Signatures Required: 2 of 3`);
  console.log(`      Signatures Provided: Alice + Bob ✓`);
  
  console.log("\n   📤 OUTPUTS:");
  console.log(`      [0] Payment: ${formatErg(CONFIG.spendAmount)}`);
  console.log(`          To: ${CONFIG.recipientAddress.slice(0, 24)}...`);
  console.log(`      [1] Remaining: ${formatErg(remainingBalance)}`);
  console.log(`          To: Multi-sig wallet (for future use)`);
  
  console.log(`\n   ⛽ Fee: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
  console.log("\n" + "═".repeat(50));

  console.log("\n🏆 Withdrawal executed successfully!");
  console.log(`   Sent: ${formatErg(CONFIG.spendAmount)}`);
  console.log(`   Remaining Treasury: ${formatErg(remainingBalance)}\n`);
}

/**
 * Show multi-sig patterns
 */
function showMultiSigPatterns(): void {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("📚 Multi-Sig Pattern Reference");
  console.log("═".repeat(60));
  console.log("\n");

  console.log("🔐 Common Multi-Sig Configurations:");
  console.log("");
  
  const patterns = [
    { scheme: "1-of-2", use: "Joint account (either party)" },
    { scheme: "2-of-2", use: "Requires both parties" },
    { scheme: "2-of-3", use: "Standard team treasury" },
    { scheme: "3-of-5", use: "DAO governance" },
    { scheme: "4-of-7", use: "Enterprise treasury" },
  ];
  
  patterns.forEach(p => {
    console.log(`   ${p.scheme.padEnd(8)} → ${p.use}`);
  });
  
  console.log("\n💡 Best Practices:");
  console.log("   • Use odd number of signers to avoid ties");
  console.log("   • Keep threshold > 50% for security");
  console.log("   • Store keys in different locations");
  console.log("   • Have backup/recovery procedures");
  console.log("   • Document signing processes\n");
}

// ════════════════════════════════════════
// 🎬 EXECUTE QUEST
// ════════════════════════════════════════

async function main() {
  try {
    await createMultiSigWallet();
    await proposeWithdrawal();
    await executeWithdrawal();
    showMultiSigPatterns();
    
    console.log("🏆 QUEST COMPLETE!");
    console.log("   Achievement Unlocked: Multi-Sig Master\n");
    console.log("✨ Example completed successfully!\n");
    
  } catch (err) {
    console.error("💀 Fatal error:", (err as Error).message);
    process.exit(1);
  }
}

main();

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 LORE: Multi-Signature Security
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Multi-sig wallets provide enhanced security by requiring multiple
 * parties to approve transactions:
 * 
 * 1. THRESHOLD SIGNATURES
 *    - atLeast(M, Coll(pk1, pk2, ..., pkN))
 *    - Requires M signatures out of N possible signers
 *    - Flexible for different security needs
 * 
 * 2. USE CASES
 *    - Team treasuries (company funds)
 *    - DAO governance (community funds)
 *    - Escrow services
 *    - Shared family wallets
 *    - Backup/recovery schemes
 * 
 * 3. SECURITY BENEFITS
 *    - No single point of failure
 *    - Protection against key theft
 *    - Enforces approval workflows
 *    - Audit trail of approvals
 * 
 * 4. IMPLEMENTATION NOTES
 *    - Each signer needs their own wallet
 *    - Coordination required for signing
 *    - Consider time-locks for additional security
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
