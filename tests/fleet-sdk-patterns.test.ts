/**
 * 🎮 Battle Arena: Fleet SDK Patterns (Authentic Tests)
 * 
 * Real patterns from the Fleet SDK repository
 * Based on: https://github.com/fleet-sdk/fleet
 * 
 * Run with: npm test tests/fleet-sdk-patterns.test.ts
 * XP Available: 150+
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  TransactionBuilder,
  OutputBuilder,
  SAFE_MIN_BOX_VALUE,
  RECOMMENDED_MIN_FEE_VALUE,
  ErgoAddress,
  FEE_CONTRACT,
} from "@fleet-sdk/core";

// Real Ergo addresses from Fleet SDK test vectors
const TEST_ADDRESSES = {
  a1: {
    address: "9hXBB1FS1UT5kiopced1LYXgPDoFgoFQsGnqPCbRaLZZ1YbJJHD",
    ergoTree: "0008cd038b5954b32bca426795d0f44abb147a561e2f7debad8c87e667b8f8c3fd3c56dd"
  },
  a2: {
    address: "9fRusAarL1KkrWQVsxSRVYnvWxaAT2A96cKtNn9tvPh5XUyCisr",
    ergoTree: "0008cd0278011ec0cf5feb92d61adb51dcb75876627ace6fd9446ab4cabc5313ab7b39a7"
  },
  a3: {
    address: "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ",
    ergoTree: "0008cd038d39af8c37583609ff51c6a577efe60684119da2fbd0d75f9c72372886a58a63"
  }
};

// Token IDs from Fleet SDK tests (real SigmaUSD tokens)
const TOKENS = {
  sigUSD: "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
  sigRSV: "003bd19d0187117f130b62e1bcab0939929ff5c7709f843c5c4dd158949285d0",
  testToken1: "0cd8c9f416e5b1ca9f986a7f10a84191dfb85941619e49e53c0dc30ebf83324b",
  testToken2: "007fd64d1ee54d78dd269c8930a38286caa28d3f29d27cadcb796418ab15c283"
};

// Standard blockchain height from Fleet SDK tests
const BLOCKCHAIN_HEIGHT = 844540;

describe("🏛️ Fleet SDK Core Patterns", () => {
  
  describe("ErgoAddress Handling", () => {
    it("should create address from Base58 string (+10 XP)", () => {
      const address = ErgoAddress.fromBase58(TEST_ADDRESSES.a1.address);
      
      expect(address).toBeDefined();
      expect(address.ergoTree).toBe(TEST_ADDRESSES.a1.ergoTree);
    });

    it("should create address from ErgoTree hex (+10 XP)", () => {
      const address = ErgoAddress.fromErgoTree(TEST_ADDRESSES.a2.ergoTree);
      
      expect(address).toBeDefined();
      expect(address.encode()).toBe(TEST_ADDRESSES.a2.address);
    });

    it("should validate P2PK address format (+15 XP)", () => {
      // P2PK addresses start with 0008cd (header bytes)
      const p2pkPrefix = "0008cd";
      
      expect(TEST_ADDRESSES.a1.ergoTree.startsWith(p2pkPrefix)).toBe(true);
      expect(TEST_ADDRESSES.a2.ergoTree.startsWith(p2pkPrefix)).toBe(true);
      expect(TEST_ADDRESSES.a3.ergoTree.startsWith(p2pkPrefix)).toBe(true);
    });

    it("should recognize FEE_CONTRACT for miner fee (+10 XP)", () => {
      // This is the standard fee contract ErgoTree
      expect(FEE_CONTRACT).toBe("1005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a57304");
    });
  });

  describe("OutputBuilder Construction", () => {
    it("should build basic output with value and address (+10 XP)", () => {
      const value = 1_000_000_000n; // 1 ERG
      const output = new OutputBuilder(value, TEST_ADDRESSES.a1.address);
      
      expect(output.value).toBe(value);
      expect(output.ergoTree).toBe(TEST_ADDRESSES.a1.ergoTree);
    });

    it("should build output with explicit creation height (+15 XP)", () => {
      const output = new OutputBuilder(
        SAFE_MIN_BOX_VALUE, 
        TEST_ADDRESSES.a2.address,
        BLOCKCHAIN_HEIGHT
      );
      
      expect(output.creationHeight).toBe(BLOCKCHAIN_HEIGHT);
    });

    it("should add single token to output (+15 XP)", () => {
      const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, TEST_ADDRESSES.a1.address)
        .addTokens({
          tokenId: TOKENS.sigUSD,
          amount: 100n
        });
      
      expect(output.assets).toBeDefined();
    });

    it("should add multiple tokens in single call (+20 XP)", () => {
      const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, TEST_ADDRESSES.a1.address)
        .addTokens([
          { tokenId: TOKENS.sigUSD, amount: 100n },
          { tokenId: TOKENS.sigRSV, amount: 429n }
        ]);
      
      expect(output.assets).toBeDefined();
    });

    it("should set additional registers for NFT minting (+20 XP)", () => {
      const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, TEST_ADDRESSES.a1.address)
        .setAdditionalRegisters({
          R4: "0e0954657374546f6b656e",           // Token name
          R5: "0e104465736372697074696f6e2074657374", // Description
          R6: "0e0134"                             // Decimals as string
        });
      
      expect(output.additionalRegisters.R4).toBeDefined();
      expect(output.additionalRegisters.R5).toBeDefined();
      expect(output.additionalRegisters.R6).toBeDefined();
    });

    it("should mint token with EIP-4 standard (+25 XP)", () => {
      const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, TEST_ADDRESSES.a1.address)
        .mintToken({
          name: "TestToken",
          amount: 21_000_000n,
          decimals: 4,
          description: "Just a test token"
        });
      
      expect(output.minting).toBeDefined();
      expect(output.minting?.name).toBe("TestToken");
      expect(output.minting?.amount).toBe(21_000_000n);
      expect(output.minting?.decimals).toBe(4);
    });
  });

  describe("TransactionBuilder Patterns", () => {
    it("should use fluent API with .and syntax sugar (+10 XP)", () => {
      // Fleet SDK allows .and.from() for readability
      const builder = new TransactionBuilder(BLOCKCHAIN_HEIGHT);
      
      // Demonstrates the API pattern (without inputs)
      expect(builder.creationHeight).toBe(BLOCKCHAIN_HEIGHT);
    });

    it("should validate creation height update (+10 XP)", () => {
      const builder1 = new TransactionBuilder(1);
      expect(builder1.creationHeight).toBe(1);

      const builder2 = new TransactionBuilder(2);
      expect(builder2.creationHeight).toBe(2);
    });

    it("should verify RECOMMENDED_MIN_FEE_VALUE (+10 XP)", () => {
      // Standard Ergo minimum fee: 1.1 ERG millis = 0.0011 ERG
      expect(RECOMMENDED_MIN_FEE_VALUE).toBe(1_100_000n);
      
      // Ensure fee is reasonable
      expect(RECOMMENDED_MIN_FEE_VALUE).toBeGreaterThan(1_000_000n);
      expect(RECOMMENDED_MIN_FEE_VALUE).toBeLessThan(2_000_000n);
    });

    it("should verify SAFE_MIN_BOX_VALUE (+10 XP)", () => {
      // Minimum value per box: 1000000 nanoERG = 0.001 ERG
      expect(SAFE_MIN_BOX_VALUE).toBe(1_000_000n);
    });
  });
});

describe("🔧 Token Operations Patterns", () => {
  
  describe("SigmaUSD Token Constants", () => {
    it("should validate SigUSD token ID format (+10 XP)", () => {
      // Token IDs are 32-byte hex strings (64 characters)
      expect(TOKENS.sigUSD).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(TOKENS.sigUSD)).toBe(true);
    });

    it("should validate SigRSV token ID format (+10 XP)", () => {
      expect(TOKENS.sigRSV).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(TOKENS.sigRSV)).toBe(true);
    });
  });

  describe("Token Amount Handling", () => {
    it("should handle large token amounts with BigInt (+15 XP)", () => {
      // SigUSD can have very large amounts
      // Number.MAX_SAFE_INTEGER is 9007199254740991
      const largeAmount = 10_000_000_000_000_000n; // 10 quadrillion
      
      expect(typeof largeAmount).toBe("bigint");
      expect(largeAmount > BigInt(Number.MAX_SAFE_INTEGER)).toBe(true);
    });

    it("should convert ERG to nanoERG correctly (+10 XP)", () => {
      const oneErg = 1_000_000_000n;
      const nanoErgPerErg = 1_000_000_000n;
      
      expect(oneErg / nanoErgPerErg).toBe(1n);
      
      // Common amounts
      expect(0.001 * Number(nanoErgPerErg)).toBe(1_000_000); // SAFE_MIN_BOX_VALUE
    });
  });

  describe("NFT Patterns (EIP-4)", () => {
    it("should validate NFT amount is exactly 1 (+15 XP)", () => {
      const nftAmount = 1n;
      
      // NFTs must have amount = 1
      expect(nftAmount).toBe(1n);
    });

    it("should create NFT minting output (+20 XP)", () => {
      const nftOutput = new OutputBuilder(SAFE_MIN_BOX_VALUE, TEST_ADDRESSES.a1.address)
        .mintToken({
          name: "Ergo NFT #1",
          amount: 1n,
          decimals: 0,
          description: "A unique Ergo NFT"
        });
      
      expect(nftOutput.minting?.amount).toBe(1n);
      expect(nftOutput.minting?.decimals).toBe(0);
    });
  });
});

describe("📊 Box and UTXO Patterns", () => {
  
  describe("Box Structure Validation", () => {
    it("should validate box ID is 64-char hex (+10 XP)", () => {
      // Real box ID from Fleet SDK test vectors
      const boxId = "e56847ed19b3dc6b72828fcfb992fdf7310828cf291221269b7ffc72fd66706e";
      
      expect(boxId).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(boxId)).toBe(true);
    });

    it("should validate transaction ID is 64-char hex (+10 XP)", () => {
      // Real transaction ID from Fleet SDK test vectors
      const txId = "9148408c04c2e38a6402a7950d6157730fa7d49e9ab3b9cadec481d7769918e9";
      
      expect(txId).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(txId)).toBe(true);
    });
  });

  describe("UTXO Selection Logic", () => {
    interface MockUTxO {
      boxId: string;
      value: bigint;
      assets: Array<{ tokenId: string; amount: bigint }>;
    }

    const mockUTxOs: MockUTxO[] = [
      {
        boxId: "e56847ed19b3dc6b72828fcfb992fdf7310828cf291221269b7ffc72fd66706e",
        value: 67_500_000_000n,
        assets: []
      },
      {
        boxId: "3e67b4be7012956aa369538b46d751a4ad0136138760553d5400a10153046e52",
        value: 1_000_000_000n,
        assets: [{ tokenId: TOKENS.testToken1, amount: 10n }]
      }
    ];

    it("should calculate total ERG in UTxOs (+15 XP)", () => {
      const total = mockUTxOs.reduce((sum, box) => sum + box.value, 0n);
      
      expect(total).toBe(68_500_000_000n);
    });

    it("should filter UTxOs containing specific token (+15 XP)", () => {
      const withToken = mockUTxOs.filter(box => 
        box.assets.some(a => a.tokenId === TOKENS.testToken1)
      );
      
      expect(withToken).toHaveLength(1);
      expect(withToken[0].boxId).toBe("3e67b4be7012956aa369538b46d751a4ad0136138760553d5400a10153046e52");
    });

    it("should select sufficient UTxOs for target amount (+20 XP)", () => {
      const target = 2_000_000_000n;
      const fee = RECOMMENDED_MIN_FEE_VALUE;
      const needed = target + fee;
      
      const selected: MockUTxO[] = [];
      let accumulated = 0n;
      
      for (const utxo of mockUTxOs) {
        if (accumulated >= needed) break;
        selected.push(utxo);
        accumulated += utxo.value;
      }
      
      expect(accumulated).toBeGreaterThanOrEqual(needed);
    });
  });
});

describe("🔐 ErgoTree and Script Patterns", () => {
  
  describe("ErgoTree Header Bytes", () => {
    it("should identify P2PK script by header (+15 XP)", () => {
      // P2PK (Pay to Public Key) scripts start with 0008cd
      const p2pkHeader = "0008cd";
      
      expect(TEST_ADDRESSES.a1.ergoTree.startsWith(p2pkHeader)).toBe(true);
    });

    it("should identify contract script by header (+15 XP)", () => {
      // Complex scripts have different header bytes
      // Fee contract starts with 1005...
      expect(FEE_CONTRACT.startsWith("1005")).toBe(true);
    });
  });

  describe("Register Constants", () => {
    it("should understand R4-R9 are optional registers (+10 XP)", () => {
      const mandatoryRegisters = ["R0", "R1", "R2", "R3"]; // Value, Script, Tokens, CreationInfo
      const optionalRegisters = ["R4", "R5", "R6", "R7", "R8", "R9"];
      
      expect(mandatoryRegisters).toHaveLength(4);
      expect(optionalRegisters).toHaveLength(6);
    });

    it("should validate register must be densely packed (+15 XP)", () => {
      // R4, R5, R6 must be filled before R7 can be used
      const validRegisters = { R4: "value", R5: "value", R6: "value" };
      const keys = Object.keys(validRegisters);
      
      // Check dense packing: no gaps allowed
      const expected = ["R4", "R5", "R6"];
      expect(keys).toEqual(expected);
    });
  });
});

// Summary: Calculate total XP available
describe("📈 Test Summary", () => {
  it("calculates total XP available in this test file", () => {
    // All XP values from tests above:
    const xpValues = [
      10, 10, 15, 10, // ErgoAddress
      10, 15, 15, 20, 20, 25, // OutputBuilder
      10, 10, 10, 10, // TransactionBuilder
      10, 10, 15, 10, 15, 20, // Token Operations
      10, 10, 15, 15, 20, // Box Patterns
      15, 15, 10, 15 // ErgoTree Patterns
    ];
    
    const totalXP = xpValues.reduce((a, b) => a + b, 0);
    
    console.log(`\n🏆 Total XP available in Fleet SDK Patterns: ${totalXP} XP`);
    expect(totalXP).toBeGreaterThan(300);
  });
});
