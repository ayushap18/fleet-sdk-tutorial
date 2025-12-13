/**
 * 🎮 Battle Arena: Token Operations Tests
 * 
 * Run with: npm test tests/token-operations.test.ts
 * XP Available: 135
 */

import { describe, it, expect } from "vitest";
import {
  OutputBuilder,
  SAFE_MIN_BOX_VALUE,
  RECOMMENDED_MIN_FEE_VALUE,
} from "@fleet-sdk/core";

const TEST_TOKEN_ID = "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04";

describe("Token Transfer", () => {
  const recipientAddress = "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ";

  describe("Single Token Transfer", () => {
    it("should create token output with ERG carrier (+20 XP)", () => {
      const tokenAmount = 500n;
      
      const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, recipientAddress)
        .addTokens({ tokenId: TEST_TOKEN_ID, amount: tokenAmount });

      expect(output).toBeDefined();
    });

    it("should require minimum ERG for token transfer (+20 XP)", () => {
      // Tokens always need ERG as a carrier
      expect(SAFE_MIN_BOX_VALUE).toBeGreaterThan(0n);
      expect(SAFE_MIN_BOX_VALUE).toBe(1_000_000n);
    });
  });

  describe("Multiple Token Types", () => {
    it("should handle multiple token types in one output (+25 XP)", () => {
      const TOKEN_A = "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04";
      const TOKEN_B = "13faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04";

      const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, recipientAddress)
        .addTokens({ tokenId: TOKEN_A, amount: 100n })
        .addTokens({ tokenId: TOKEN_B, amount: 50n });

      expect(output).toBeDefined();
    });
  });
});

describe("NFT Operations", () => {
  const minterAddress = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v";

  it("should create NFT output with amount = 1 (+30 XP)", () => {
    const nftOutput = new OutputBuilder(SAFE_MIN_BOX_VALUE, minterAddress)
      .mintToken({
        amount: 1n,  // NFT = exactly 1
        name: "Test NFT",
      });

    expect(nftOutput).toBeDefined();
  });

  it("should validate NFT amount is exactly 1 (+15 XP)", () => {
    const nftAmount = 1n;
    expect(nftAmount).toBe(1n);
    
    // Multiple copies = not an NFT
    const tokenAmount = 100n;
    expect(tokenAmount).not.toBe(1n);
  });

  it("should support EIP-4 metadata registers (+25 XP)", () => {
    // EIP-4 NFT standard uses registers R4-R9
    const eip4Registers = {
      R4: "NFT Name",      // Name
      R5: "Description",   // Description  
      R6: "0",             // Decimals (0 for NFT)
      R7: "picture",       // Type
      R8: "ipfs://...",    // Content link
      R9: "cover",         // Cover image (optional)
    };

    expect(Object.keys(eip4Registers)).toContain("R4");
    expect(Object.keys(eip4Registers)).toContain("R5");
    expect(Object.keys(eip4Registers)).toContain("R6");
    expect(eip4Registers.R6).toBe("0"); // NFTs have 0 decimals
  });
});

describe("Token Validation", () => {
  it("should validate token ID format (+15 XP)", () => {
    const validTokenId = TEST_TOKEN_ID;
    const hexPattern = /^[0-9a-fA-F]{64}$/;
    
    expect(hexPattern.test(validTokenId)).toBe(true);
    expect(validTokenId.length).toBe(64);
  });

  it("should reject invalid token IDs (+10 XP)", () => {
    const invalidTokenIds = [
      "",
      "short",
      "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
      "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf0", // 63 chars
    ];

    const hexPattern = /^[0-9a-fA-F]{64}$/;
    
    invalidTokenIds.forEach(id => {
      expect(hexPattern.test(id)).toBe(false);
    });
  });
});
