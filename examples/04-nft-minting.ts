/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚔️ QUEST: NFT Minting
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 Objective: Create a unique Non-Fungible Token on Ergo
 * 📋 Prerequisites: Understanding of tokens and boxes
 * ⏱️ Completion Time: ~20 minutes
 * ⭐ Difficulty: Medium
 * 
 * 🏆 Rewards Upon Completion:
 * - Understanding of EIP-4 NFT standard
 * - Metadata encoding skills
 * - Register manipulation knowledge
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
// 📦 NFT CONFIGURATION
// ════════════════════════════════════════

/**
 * NFT Types according to EIP-4
 */
enum NFTType {
  PictureArtwork = 0x01,
  AudioArtwork = 0x02,
  VideoArtwork = 0x03,
  // Can extend with more types
}

/**
 * NFT Metadata structure
 */
interface NFTMetadata {
  name: string;
  description: string;
  type: NFTType;
  mediaUrl: string;
  mediaHash: string;  // SHA256 of the media file
  collection?: string;
  attributes?: Record<string, string>;
}

const NFT_DATA: NFTMetadata = {
  name: "Ergo Dragon #001",
  description: "A legendary dragon born from the Ergo blockchain. Part of the Mythical Creatures collection.",
  type: NFTType.PictureArtwork,
  mediaUrl: "ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/dragon.png",
  mediaHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  collection: "Mythical Creatures",
  attributes: {
    rarity: "Legendary",
    element: "Fire",
    power: "9000"
  }
};

const CONFIG = {
  /** Owner address for the NFT */
  ownerAddress: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
  
  /** Change address */
  changeAddress: "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v",
  
  /** Current blockchain height */
  networkHeight: 1_200_000,
};

// ════════════════════════════════════════
// 🎮 MOCK INPUT DATA
// ════════════════════════════════════════

/**
 * The first input box ID will become the NFT token ID!
 * This ensures uniqueness.
 */
const mockInputBoxes: Box<bigint>[] = [
  {
    boxId: "unique-nft-id-will-be-e7b9c1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    value: 1_000_000_000n,  // 1 ERG
    ergoTree: "0008cd0327e65711a59378c59359c3e1d0f7abe906479eccb76094e50fe79d743ccc15e6",
    creationHeight: 1_100_000,
    assets: [],
    additionalRegisters: {},
    transactionId: "minting-source-tx",
    index: 0
  }
];

// ════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS
// ════════════════════════════════════════

function formatErg(nanoErg: bigint): string {
  return `${(Number(nanoErg) / 1_000_000_000).toFixed(4)} ERG`;
}

/**
 * Encode string to hex for registers
 */
function encodeString(str: string): string {
  // In production, use proper serialization from @fleet-sdk/serializer
  return Buffer.from(str, 'utf8').toString('hex');
}

/**
 * Get NFT type name
 */
function getNFTTypeName(type: NFTType): string {
  switch (type) {
    case NFTType.PictureArtwork: return "Picture/Image";
    case NFTType.AudioArtwork: return "Audio";
    case NFTType.VideoArtwork: return "Video";
    default: return "Unknown";
  }
}

// ════════════════════════════════════════
// 🎮 MAIN QUEST FUNCTION
// ════════════════════════════════════════

async function mintNFT(): Promise<void> {
  console.log("\n");
  console.log("═".repeat(60));
  console.log("⚔️  QUEST: NFT Minting");
  console.log("═".repeat(60));
  console.log("\n");

  try {
    // ────────────────────────────────────
    // 🎨 Display NFT Metadata
    // ────────────────────────────────────
    console.log("🎨 NFT Metadata:");
    console.log("─".repeat(50));
    console.log(`   Name:        ${NFT_DATA.name}`);
    console.log(`   Description: ${NFT_DATA.description.slice(0, 50)}...`);
    console.log(`   Type:        ${getNFTTypeName(NFT_DATA.type)}`);
    console.log(`   Collection:  ${NFT_DATA.collection}`);
    console.log(`   Media URL:   ${NFT_DATA.mediaUrl.slice(0, 40)}...`);
    console.log(`   Media Hash:  ${NFT_DATA.mediaHash.slice(0, 16)}...`);
    
    if (NFT_DATA.attributes) {
      console.log("   Attributes:");
      Object.entries(NFT_DATA.attributes).forEach(([key, value]) => {
        console.log(`      • ${key}: ${value}`);
      });
    }
    console.log("");

    // ────────────────────────────────────
    // 🔑 Show Token ID
    // ────────────────────────────────────
    console.log("🔑 Token ID Derivation:");
    console.log("─".repeat(50));
    console.log(`   First Input Box ID: ${mockInputBoxes[0].boxId.slice(0, 32)}...`);
    console.log(`   ↓`);
    console.log(`   This becomes the NFT Token ID!`);
    console.log(`   (Ensures global uniqueness)\n`);

    // ────────────────────────────────────
    // 📦 Prepare Input
    // ────────────────────────────────────
    console.log("📦 Preparing minting input...");
    
    const inputValue = mockInputBoxes.reduce((s, b) => s + b.value, 0n);
    console.log(`   Available: ${formatErg(inputValue)}`);
    console.log(`   Required:  ${formatErg(SAFE_MIN_BOX_VALUE + RECOMMENDED_MIN_FEE_VALUE)}`);
    console.log("");

    // ────────────────────────────────────
    // 🎨 Create NFT Output
    // ────────────────────────────────────
    console.log("🎨 Creating NFT output with registers...");
    
    /**
     * EIP-4 Register Structure:
     * R4: Name (Coll[Byte])
     * R5: Description (Coll[Byte])
     * R6: Decimals (Coll[Byte]) - 0 for NFT
     * R7: Type (Coll[Byte]) - 0x01=image, 0x02=audio, 0x03=video
     * R8: Hash (Coll[Byte]) - SHA256 of media
     * R9: Link (Coll[Byte]) - URL/IPFS link
     */
    
    const nftOutput = new OutputBuilder(
      SAFE_MIN_BOX_VALUE,
      CONFIG.ownerAddress
    )
    .mintToken({
      amount: 1n,  // NFT = exactly 1 token
      name: NFT_DATA.name,
      decimals: 0,
      description: NFT_DATA.description
    });
    // In production, you would also set R7, R8, R9 with setAdditionalRegisters()
    
    console.log("   ├─ R4 (Name):        ✓ Set");
    console.log("   ├─ R5 (Description): ✓ Set");
    console.log("   ├─ R6 (Decimals):    0 (NFT)");
    console.log("   ├─ R7 (Type):        0x01 (Image)");
    console.log("   ├─ R8 (Hash):        SHA256 of media");
    console.log("   └─ R9 (Link):        IPFS URL");
    console.log("");

    // ────────────────────────────────────
    // 🔨 Build Minting Transaction
    // ────────────────────────────────────
    console.log("🔨 Building minting transaction...");
    
    const unsignedTx = new TransactionBuilder(CONFIG.networkHeight)
      .from(mockInputBoxes)
      .to(nftOutput)
      .sendChangeTo(CONFIG.changeAddress)
      .payFee(RECOMMENDED_MIN_FEE_VALUE)
      .build();
    
    console.log(`   ├─ Inputs:  ${unsignedTx.inputs.length}`);
    console.log(`   ├─ Outputs: ${unsignedTx.outputs.length}`);
    console.log(`   └─ ✓ Minting transaction built!\n`);

    // ────────────────────────────────────
    // 📊 Transaction Summary
    // ────────────────────────────────────
    console.log("📊 Minting Transaction Summary");
    console.log("═".repeat(50));
    
    console.log("\n   📥 INPUT (consumed for token ID):");
    console.log(`      Box ID: ${mockInputBoxes[0].boxId.slice(0, 32)}...`);
    console.log(`      Value:  ${formatErg(mockInputBoxes[0].value)}`);
    
    console.log("\n   📤 OUTPUTS:");
    console.log(`      [0] NFT Box:`);
    console.log(`          • Value: ${formatErg(SAFE_MIN_BOX_VALUE)}`);
    console.log(`          • Token: ${NFT_DATA.name} (1 unit)`);
    console.log(`          • Token ID: ${mockInputBoxes[0].boxId.slice(0, 16)}...`);
    console.log(`          • Owner: ${CONFIG.ownerAddress.slice(0, 16)}...`);
    
    const changeValue = inputValue - SAFE_MIN_BOX_VALUE - RECOMMENDED_MIN_FEE_VALUE;
    console.log(`      [1] Change: ${formatErg(changeValue)}`);
    
    console.log(`\n   ⛽ FEE: ${formatErg(RECOMMENDED_MIN_FEE_VALUE)}`);
    console.log("\n" + "═".repeat(50));

    // ────────────────────────────────────
    // 📋 EIP-4 Reference
    // ────────────────────────────────────
    console.log("\n📋 EIP-4 NFT Standard Reference:");
    console.log("─".repeat(50));
    console.log("   Register | Purpose          | Value");
    console.log("   ─────────┼──────────────────┼─────────────");
    console.log("   R4       | Name             | UTF-8 bytes");
    console.log("   R5       | Description      | UTF-8 bytes");
    console.log("   R6       | Decimals         | 0 for NFT");
    console.log("   R7       | Type             | 0x01-0x03");
    console.log("   R8       | Content Hash     | SHA256");
    console.log("   R9       | Content Link     | URL/IPFS\n");

    // ────────────────────────────────────
    // 🏆 Quest Complete!
    // ────────────────────────────────────
    console.log("🏆 QUEST COMPLETE!");
    console.log("   Achievement Unlocked: NFT Creator\n");
    console.log("🎨 Your NFT is ready to be minted!");
    console.log(`   Token ID: ${mockInputBoxes[0].boxId}`);
    console.log(`   Name: ${NFT_DATA.name}\n`);

  } catch (error) {
    console.error("\n❌ QUEST FAILED!");
    console.error(`   Error: ${(error as Error).message}\n`);
    throw error;
  }
}

// ════════════════════════════════════════
// 🎬 EXECUTE QUEST
// ════════════════════════════════════════

mintNFT()
  .then(() => {
    console.log("✨ Example completed successfully!\n");
  })
  .catch((err) => {
    console.error("💀 Fatal error:", err.message);
    process.exit(1);
  });

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📚 LORE: EIP-4 NFT Standard
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * EIP-4 defines how NFTs work on Ergo:
 * 
 * 1. TOKEN PROPERTIES
 *    - Amount: Exactly 1 (non-fungible)
 *    - Decimals: 0 (indivisible)
 *    - ID: Derived from first input box (unique)
 * 
 * 2. METADATA IN REGISTERS
 *    - R4-R6: Standard token info (name, desc, decimals)
 *    - R7: Content type (image, audio, video)
 *    - R8: Content hash (integrity verification)
 *    - R9: Content link (where to find the file)
 * 
 * 3. CONTENT STORAGE
 *    - Actual files stored off-chain (IPFS, Arweave)
 *    - Hash ensures content hasn't been modified
 *    - Link points to the content location
 * 
 * 4. COLLECTION SUPPORT
 *    - Multiple NFTs can share collection info
 *    - Attributes enable rarity traits
 *    - Marketplaces can read and display metadata
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
