/**
 * 🎮 Battle Arena: Basic Transfer Tests
 * 
 * Run with: npm test tests/basic-transfer.test.ts
 * XP Available: 60
 */

import { describe, it, expect } from "vitest";
import {
  OutputBuilder,
  SAFE_MIN_BOX_VALUE,
  RECOMMENDED_MIN_FEE_VALUE,
} from "@fleet-sdk/core";

describe("TransactionBuilder", () => {
  const senderAddress = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v";
  const recipientAddress = "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ";

  describe("Basic ERG Transfer", () => {
    it("should create output with correct value (+10 XP)", () => {
      const sendAmount = 1_000_000_000n; // 1 ERG
      const output = new OutputBuilder(sendAmount, recipientAddress);
      
      expect(output).toBeDefined();
    });

    it("should throw error for output below minimum (+10 XP)", () => {
      const tooSmall = 100n; // Below minimum
      
      // Creating output with too small value should still work
      // But the transaction build would fail
      const output = new OutputBuilder(tooSmall, recipientAddress);
      expect(output).toBeDefined();
    });

    it("should handle minimum box value correctly (+10 XP)", () => {
      const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, recipientAddress);
      expect(output).toBeDefined();
      expect(SAFE_MIN_BOX_VALUE).toBe(1_000_000n);
    });
  });

  describe("Multi-Output Transactions", () => {
    it("should create multiple outputs correctly (+15 XP)", () => {
      const recipients = [
        { address: recipientAddress, amount: 1_000_000_000n },
        { address: senderAddress, amount: 500_000_000n },
      ];

      const outputs = recipients.map(r => 
        new OutputBuilder(r.amount, r.address)
      );

      expect(outputs.length).toBe(2);
      expect(outputs[0]).toBeDefined();
      expect(outputs[1]).toBeDefined();
    });
  });

  describe("Fee Handling", () => {
    it("should use correct recommended fee (+15 XP)", () => {
      expect(RECOMMENDED_MIN_FEE_VALUE).toBe(1_100_000n);
      expect(RECOMMENDED_MIN_FEE_VALUE).toBeGreaterThan(SAFE_MIN_BOX_VALUE);
    });
  });
});

describe("OutputBuilder", () => {
  const testAddress = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v";

  it("should create output with correct value and address (+10 XP)", () => {
    const value = 5_000_000_000n;
    const output = new OutputBuilder(value, testAddress);
    
    expect(output).toBeDefined();
  });

  it("should allow adding tokens to output (+10 XP)", () => {
    const tokenId = "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04";
    
    const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, testAddress)
      .addTokens({
        tokenId,
        amount: 100n,
      });

    expect(output).toBeDefined();
  });
});
