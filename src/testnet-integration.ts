/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🌐 TESTNET INTEGRATION MODULE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Connect to Ergo Testnet for real blockchain interactions.
 * Get testnet ERG from: https://testnet-faucet.ergoplatform.com
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { 
  TransactionBuilder, 
  OutputBuilder,
  SAFE_MIN_BOX_VALUE,
  type Box 
} from "@fleet-sdk/core";

// ════════════════════════════════════════
// 📡 TESTNET CONFIGURATION
// ════════════════════════════════════════

export const TESTNET_CONFIG = {
  explorerApi: "https://api-testnet.ergoplatform.com/api/v1",
  explorerUrl: "https://testnet.ergoplatform.com",
  nodeApi: "https://testnet-node.ergoplatform.com",
  networkType: "testnet" as const,
};

export const MAINNET_CONFIG = {
  explorerApi: "https://api.ergoplatform.com/api/v1",
  explorerUrl: "https://explorer.ergoplatform.com",
  nodeApi: "https://node.ergoplatform.com",
  networkType: "mainnet" as const,
};

// ════════════════════════════════════════
// 📦 EXPLORER API CLIENT
// ════════════════════════════════════════

export class ErgoExplorerClient {
  private baseUrl: string;
  private networkType: "mainnet" | "testnet";

  constructor(config = TESTNET_CONFIG) {
    this.baseUrl = config.explorerApi;
    this.networkType = config.networkType;
  }

  /**
   * Get current blockchain height
   */
  async getCurrentHeight(): Promise<number> {
    const response = await fetch(`${this.baseUrl}/networkState`);
    const data = await response.json() as { height: number };
    return data.height;
  }

  /**
   * Get unspent boxes for an address
   */
  async getUnspentBoxes(address: string, limit = 50): Promise<Box<string>[]> {
    const response = await fetch(
      `${this.baseUrl}/boxes/unspent/byAddress/${address}?limit=${limit}`
    );
    const data = await response.json() as { items: any[] };
    return data.items.map(this.mapExplorerBox);
  }

  /**
   * Get balance for an address
   */
  async getBalance(address: string): Promise<{
    nanoErg: bigint;
    tokens: { tokenId: string; amount: bigint; name?: string }[];
  }> {
    const response = await fetch(
      `${this.baseUrl}/addresses/${address}/balance/total`
    );
    const data = await response.json() as { nanoErgs: string; tokens: any[] };
    
    return {
      nanoErg: BigInt(data.nanoErgs),
      tokens: data.tokens.map((t: any) => ({
        tokenId: t.tokenId,
        amount: BigInt(t.amount),
        name: t.name,
      })),
    };
  }

  /**
   * Get transaction by ID
   */
  async getTransaction(txId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/transactions/${txId}`);
    return response.json();
  }

  /**
   * Check if transaction is confirmed
   */
  async isTransactionConfirmed(txId: string): Promise<boolean> {
    try {
      const tx = await this.getTransaction(txId);
      return tx.numConfirmations > 0;
    } catch {
      return false;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForConfirmation(
    txId: string, 
    timeoutMs = 120000,
    pollIntervalMs = 5000
  ): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const confirmed = await this.isTransactionConfirmed(txId);
      if (confirmed) return true;
      
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
    }
    
    return false;
  }

  /**
   * Map explorer box format to Fleet SDK format
   */
  private mapExplorerBox(box: any): Box<string> {
    return {
      boxId: box.boxId,
      value: box.value.toString(),
      ergoTree: box.ergoTree,
      creationHeight: box.creationHeight,
      assets: box.assets.map((a: any) => ({
        tokenId: a.tokenId,
        amount: a.amount.toString(),
      })),
      additionalRegisters: box.additionalRegisters || {},
      transactionId: box.transactionId,
      index: box.index,
    };
  }
}

// ════════════════════════════════════════
// 🔧 TRANSACTION BUILDER HELPERS
// ════════════════════════════════════════

/**
 * Build a testnet transfer transaction
 */
export async function buildTestnetTransfer(params: {
  senderAddress: string;
  recipientAddress: string;
  amountNanoErg: bigint;
  explorer?: ErgoExplorerClient;
}): Promise<{
  unsignedTx: any;
  explorerLink: string;
}> {
  const explorer = params.explorer || new ErgoExplorerClient(TESTNET_CONFIG);
  
  // Fetch current height
  const height = await explorer.getCurrentHeight();
  
  // Fetch sender's boxes
  const boxes = await explorer.getUnspentBoxes(params.senderAddress);
  
  if (boxes.length === 0) {
    throw new Error("No unspent boxes found. Get testnet ERG from faucet.");
  }

  // Build the transaction
  const unsignedTx = new TransactionBuilder(height)
    .from(boxes)
    .to(
      new OutputBuilder(params.amountNanoErg.toString(), params.recipientAddress)
    )
    .sendChangeTo(params.senderAddress)
    .payMinFee()
    .build();

  return {
    unsignedTx: unsignedTx.toEIP12Object(),
    explorerLink: `${TESTNET_CONFIG.explorerUrl}/en/transactions/`,
  };
}

// ════════════════════════════════════════
// 🎮 INTERACTIVE DEMO
// ════════════════════════════════════════

async function demo() {
  console.log("🌐 Ergo Testnet Integration Demo\n");
  
  const explorer = new ErgoExplorerClient(TESTNET_CONFIG);
  
  try {
    // Get current height
    const height = await explorer.getCurrentHeight();
    console.log(`📊 Current testnet height: ${height}`);
    
    // Example address (use your own testnet address)
    const testAddress = "3WwbYP5VrgDwi7gxJbLdYTe4W5Zxi6mH2UiQCv2JqDLbBVpgH8Xv";
    
    console.log(`\n📬 Checking address: ${testAddress.slice(0, 20)}...`);
    
    const balance = await explorer.getBalance(testAddress);
    console.log(`💰 Balance: ${Number(balance.nanoErg) / 1e9} ERG`);
    console.log(`🪙 Tokens: ${balance.tokens.length}`);
    
    const boxes = await explorer.getUnspentBoxes(testAddress);
    console.log(`📦 Unspent boxes: ${boxes.length}`);
    
  } catch (error: any) {
    console.log(`\n⚠️ Error: ${error.message}`);
    console.log("This is expected if the address has no funds.");
    console.log("\n🚰 Get testnet ERG: https://testnet-faucet.ergoplatform.com");
  }
}

// Run demo if executed directly
if (import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/'))) {
  demo();
}

export default {
  ErgoExplorerClient,
  buildTestnetTransfer,
  TESTNET_CONFIG,
  MAINNET_CONFIG,
};
