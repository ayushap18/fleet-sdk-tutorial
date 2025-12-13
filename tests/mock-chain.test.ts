/**
 * Unit Tests: Mock Chain Integration
 * 
 * Tests using @fleet-sdk/mock-chain for local simulation
 * Run with: pnpm test
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  TransactionBuilder,
  OutputBuilder,
  SAFE_MIN_BOX_VALUE,
  RECOMMENDED_MIN_FEE_VALUE,
} from "@fleet-sdk/core";

// Note: @fleet-sdk/mock-chain provides MockChain for full simulation
// These tests demonstrate patterns even without the mock-chain package

describe("Mock Chain Patterns", () => {
  
  describe("Box Selection Strategies", () => {
    interface MockBox {
      id: string;
      value: bigint;
    }

    function selectBoxesFirstFit(boxes: MockBox[], target: bigint): MockBox[] {
      const selected: MockBox[] = [];
      let total = 0n;
      
      for (const box of boxes) {
        if (total >= target) break;
        selected.push(box);
        total += box.value;
      }
      
      return selected;
    }

    function selectBoxesLargestFirst(boxes: MockBox[], target: bigint): MockBox[] {
      const sorted = [...boxes].sort((a, b) => 
        a.value > b.value ? -1 : a.value < b.value ? 1 : 0
      );
      return selectBoxesFirstFit(sorted, target);
    }

    it("should select boxes using first-fit strategy", () => {
      const boxes: MockBox[] = [
        { id: "1", value: 100n },
        { id: "2", value: 200n },
        { id: "3", value: 300n },
      ];

      const selected = selectBoxesFirstFit(boxes, 250n);
      
      // First-fit: 100 + 200 = 300 >= 250, so we need 2 boxes
      expect(selected.length).toBe(2);
      expect(selected.reduce((sum, b) => sum + b.value, 0n)).toBeGreaterThanOrEqual(250n);
    });

    it("should select boxes using largest-first strategy", () => {
      const boxes: MockBox[] = [
        { id: "1", value: 100n },
        { id: "2", value: 500n },
        { id: "3", value: 200n },
      ];

      const selected = selectBoxesLargestFirst(boxes, 400n);
      
      // Should pick 500 first (largest), which covers 400
      expect(selected.length).toBe(1);
      expect(selected[0].id).toBe("2");
    });
  });

  describe("Transaction Simulation", () => {
    interface SimulatedBox {
      boxId: string;
      value: bigint;
      spent: boolean;
    }

    class SimpleChainSimulator {
      private boxes: Map<string, SimulatedBox> = new Map();
      private height: number = 1_000_000;

      addBox(value: bigint): string {
        const boxId = `box-${this.boxes.size}-${Date.now()}`;
        this.boxes.set(boxId, { boxId, value, spent: false });
        return boxId;
      }

      getUnspentBoxes(): SimulatedBox[] {
        return Array.from(this.boxes.values()).filter(b => !b.spent);
      }

      spendBox(boxId: string): boolean {
        const box = this.boxes.get(boxId);
        if (box && !box.spent) {
          box.spent = true;
          return true;
        }
        return false;
      }

      getBalance(): bigint {
        return this.getUnspentBoxes().reduce((sum, b) => sum + b.value, 0n);
      }

      incrementHeight(): void {
        this.height++;
      }

      getCurrentHeight(): number {
        return this.height;
      }
    }

    let simulator: SimpleChainSimulator;

    beforeEach(() => {
      simulator = new SimpleChainSimulator();
    });

    it("should track unspent boxes correctly", () => {
      const boxId1 = simulator.addBox(1000n);
      const boxId2 = simulator.addBox(2000n);

      expect(simulator.getBalance()).toBe(3000n);
      expect(simulator.getUnspentBoxes().length).toBe(2);

      simulator.spendBox(boxId1);

      expect(simulator.getBalance()).toBe(2000n);
      expect(simulator.getUnspentBoxes().length).toBe(1);
    });

    it("should prevent double spending", () => {
      const boxId = simulator.addBox(1000n);
      
      expect(simulator.spendBox(boxId)).toBe(true);
      expect(simulator.spendBox(boxId)).toBe(false); // Already spent
    });

    it("should track height correctly", () => {
      const initialHeight = simulator.getCurrentHeight();
      
      simulator.incrementHeight();
      simulator.incrementHeight();
      
      expect(simulator.getCurrentHeight()).toBe(initialHeight + 2);
    });
  });

  describe("Contract Condition Testing", () => {
    interface ContractCondition {
      evaluate(context: { height: number; signerPk?: string }): boolean;
    }

    class HeightCondition implements ContractCondition {
      constructor(private unlockHeight: number) {}
      
      evaluate(context: { height: number }): boolean {
        return context.height >= this.unlockHeight;
      }
    }

    class SignerCondition implements ContractCondition {
      constructor(private requiredPk: string) {}
      
      evaluate(context: { signerPk?: string }): boolean {
        return context.signerPk === this.requiredPk;
      }
    }

    class AndCondition implements ContractCondition {
      constructor(private conditions: ContractCondition[]) {}
      
      evaluate(context: { height: number; signerPk?: string }): boolean {
        return this.conditions.every(c => c.evaluate(context));
      }
    }

    it("should evaluate height lock correctly", () => {
      const heightLock = new HeightCondition(1_500_000);
      
      expect(heightLock.evaluate({ height: 1_400_000 })).toBe(false);
      expect(heightLock.evaluate({ height: 1_500_000 })).toBe(true);
      expect(heightLock.evaluate({ height: 1_600_000 })).toBe(true);
    });

    it("should evaluate signer condition correctly", () => {
      const ownerPk = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v";
      const signerCheck = new SignerCondition(ownerPk);
      
      expect(signerCheck.evaluate({ height: 0, signerPk: ownerPk })).toBe(true);
      expect(signerCheck.evaluate({ height: 0, signerPk: "wrong-key" })).toBe(false);
    });

    it("should combine conditions with AND", () => {
      const ownerPk = "9f4QF8AD1nQ3nJahQVkMj8hFSVVzVom77b52JU7EW71Zexg6N8v";
      
      const combined = new AndCondition([
        new HeightCondition(1_500_000),
        new SignerCondition(ownerPk),
      ]);

      // Both conditions must be true
      expect(combined.evaluate({ height: 1_400_000, signerPk: ownerPk })).toBe(false);
      expect(combined.evaluate({ height: 1_600_000, signerPk: "wrong" })).toBe(false);
      expect(combined.evaluate({ height: 1_600_000, signerPk: ownerPk })).toBe(true);
    });
  });
});
