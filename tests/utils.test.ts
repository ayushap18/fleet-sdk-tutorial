/**
 * Unit Tests: Utility Functions
 * 
 * Run with: pnpm test
 */

import { describe, it, expect } from "vitest";
import { SAFE_MIN_BOX_VALUE, RECOMMENDED_MIN_FEE_VALUE } from "@fleet-sdk/core";

describe("Constants", () => {
  it("should have correct SAFE_MIN_BOX_VALUE", () => {
    // 0.001 ERG in nanoERG
    expect(SAFE_MIN_BOX_VALUE).toBe(1_000_000n);
  });

  it("should have correct RECOMMENDED_MIN_FEE_VALUE", () => {
    // 0.0011 ERG in nanoERG
    expect(RECOMMENDED_MIN_FEE_VALUE).toBe(1_100_000n);
  });
});

describe("ERG Conversions", () => {
  const NANOERG_PER_ERG = 1_000_000_000n;

  function ergToNanoErg(erg: number): bigint {
    return BigInt(Math.floor(erg * 1_000_000_000));
  }

  function nanoErgToErg(nanoErg: bigint): number {
    return Number(nanoErg) / 1_000_000_000;
  }

  it("should convert ERG to nanoERG correctly", () => {
    expect(ergToNanoErg(1)).toBe(1_000_000_000n);
    expect(ergToNanoErg(0.5)).toBe(500_000_000n);
    expect(ergToNanoErg(10.5)).toBe(10_500_000_000n);
  });

  it("should convert nanoERG to ERG correctly", () => {
    expect(nanoErgToErg(1_000_000_000n)).toBe(1);
    expect(nanoErgToErg(500_000_000n)).toBe(0.5);
    expect(nanoErgToErg(10_500_000_000n)).toBe(10.5);
  });
});

describe("Address Validation", () => {
  function isValidErgoAddress(address: string): boolean {
    // Basic validation rules for Ergo mainnet addresses
    if (!address || address.length < 40 || address.length > 60) {
      return false;
    }
    
    // Mainnet P2PK addresses start with '9'
    // P2S (script) addresses start with various prefixes
    const validPrefixes = ["9", "3", "8"];
    
    return validPrefixes.some(p => address.startsWith(p));
  }

  it("should validate correct P2PK addresses", () => {
    const validAddress = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v";
    expect(isValidErgoAddress(validAddress)).toBe(true);
  });

  it("should reject invalid addresses", () => {
    expect(isValidErgoAddress("")).toBe(false);
    expect(isValidErgoAddress("short")).toBe(false);
    expect(isValidErgoAddress("invalid-prefix-address-that-is-long-enough")).toBe(false);
  });
});

describe("Token ID Validation", () => {
  function isValidTokenId(tokenId: string): boolean {
    // Token IDs are 64 character hex strings
    const hexPattern = /^[0-9a-fA-F]{64}$/;
    return hexPattern.test(tokenId);
  }

  it("should validate correct token IDs", () => {
    const validTokenId = "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04";
    expect(isValidTokenId(validTokenId)).toBe(true);
  });

  it("should reject invalid token IDs", () => {
    expect(isValidTokenId("")).toBe(false);
    expect(isValidTokenId("short")).toBe(false);
    expect(isValidTokenId("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")).toBe(false);
  });
});

describe("Box Value Calculations", () => {
  function calculateMinimumErg(
    numTokens: number,
    dataSize: number = 0
  ): bigint {
    // Approximate minimum ERG needed based on box size
    const baseMinimum = SAFE_MIN_BOX_VALUE;
    const tokenOverhead = BigInt(numTokens) * 100_000n; // ~0.0001 ERG per token type
    const dataOverhead = BigInt(dataSize) * 1_000n; // Per byte of register data
    
    return baseMinimum + tokenOverhead + dataOverhead;
  }

  it("should calculate minimum for simple box", () => {
    expect(calculateMinimumErg(0)).toBe(SAFE_MIN_BOX_VALUE);
  });

  it("should increase minimum for boxes with tokens", () => {
    const withTokens = calculateMinimumErg(3);
    expect(withTokens).toBeGreaterThan(SAFE_MIN_BOX_VALUE);
  });

  it("should increase minimum for boxes with data", () => {
    const withData = calculateMinimumErg(0, 100);
    expect(withData).toBeGreaterThan(SAFE_MIN_BOX_VALUE);
  });
});

describe("Transaction Fee Estimation", () => {
  function estimateFee(
    numInputs: number,
    numOutputs: number,
    hasTokens: boolean = false
  ): bigint {
    // Base fee
    let fee = RECOMMENDED_MIN_FEE_VALUE;
    
    // Add for complexity
    if (numInputs > 2) {
      fee += BigInt(numInputs - 2) * 100_000n;
    }
    if (numOutputs > 2) {
      fee += BigInt(numOutputs - 2) * 100_000n;
    }
    if (hasTokens) {
      fee += 200_000n;
    }
    
    return fee;
  }

  it("should return minimum fee for simple transaction", () => {
    expect(estimateFee(1, 2)).toBe(RECOMMENDED_MIN_FEE_VALUE);
  });

  it("should increase fee for complex transactions", () => {
    const complexFee = estimateFee(5, 5, true);
    expect(complexFee).toBeGreaterThan(RECOMMENDED_MIN_FEE_VALUE);
  });
});
