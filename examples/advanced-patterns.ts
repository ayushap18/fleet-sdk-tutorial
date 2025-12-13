/**
 * Advanced Fleet SDK Patterns
 * 
 * Real-world patterns from Fleet SDK repository
 * Based on: https://github.com/fleet-sdk/fleet
 * 
 * This file demonstrates patterns used in production Ergo applications
 */

import {
  TransactionBuilder,
  OutputBuilder,
  SAFE_MIN_BOX_VALUE,
  RECOMMENDED_MIN_FEE_VALUE,
  ErgoAddress,
  FEE_CONTRACT,
  Network,
} from "@fleet-sdk/core";

// ============================================================
// AUTHENTIC ERGO ADDRESSES (From Fleet SDK Test Vectors)
// ============================================================

export const TEST_ADDRESSES = {
  // Standard P2PK (Pay-to-Public-Key) addresses
  alice: {
    address: "9hXBB1FS1UT5kiopced1LYXgPDoFgoFQsGnqPCbRaLZZ1YbJJHD",
    ergoTree: "0008cd038b5954b32bca426795d0f44abb147a561e2f7debad8c87e667b8f8c3fd3c56dd"
  },
  bob: {
    address: "9fRusAarL1KkrWQVsxSRVYnvWxaAT2A96cKtNn9tvPh5XUyCisr",
    ergoTree: "0008cd0278011ec0cf5feb92d61adb51dcb75876627ace6fd9446ab4cabc5313ab7b39a7"
  },
  charlie: {
    address: "9hY16vzHmmfyVBwKeFGHvb2bMFsG94A1u7To1QWtUokACyFVENQ",
    ergoTree: "0008cd038d39af8c37583609ff51c6a577efe60684119da2fbd0d75f9c72372886a58a63"
  }
};

// ============================================================
// REAL TOKEN IDS (From SigmaUSD Protocol)
// ============================================================

export const SIGMA_USD_TOKENS = {
  // SigUSD stablecoin (pegged to USD)
  sigUSD: "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
  
  // SigRSV reserve coin (absorbs volatility)
  sigRSV: "003bd19d0187117f130b62e1bcab0939929ff5c7709f843c5c4dd158949285d0",
  
  // Bank NFT (identifies the real SigmaUSD bank box)
  bankNFT: "7d672d1def471720ca5782fd6473e47e796d9ac0c138d9911346f118b2f6d9d9",
  
  // Oracle Pool NFT (identifies oracle data)
  oracleNFT: "011d3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6eda887f"
};

// ============================================================
// BLOCKCHAIN PARAMETERS (From Real Ergo Network)
// ============================================================

export const BLOCKCHAIN_PARAMS = {
  // Block height used in Fleet SDK tests
  testHeight: 844540,
  
  // Storage fee factor
  storageFee: 1250000n,
  
  // Minimum value per byte
  minValuePerByte: 360n,
  
  // Maximum block size
  maxBlockSize: 1271009,
  
  // Block time in milliseconds (2 minutes)
  blockTimeMs: 120000,
  
  // Network prefix (mainnet)
  networkPrefix: Network.Mainnet
};

// ============================================================
// PATTERN 1: Simple ERG Transfer (Fleet SDK Style)
// ============================================================

/**
 * Creates a simple ERG transfer transaction
 * 
 * From Fleet SDK README:
 * ```
 * const unsignedTransaction = new TransactionBuilder(creationHeight)
 *   .from(inputs)
 *   .to(new OutputBuilder(1000000n, recipientAddress))
 *   .sendChangeTo(changeAddress)
 *   .payMinFee()
 *   .build();
 * ```
 */
export function buildSimpleTransfer(
  inputs: { boxId: string; value: bigint; ergoTree: string }[],
  recipient: string,
  amount: bigint,
  changeAddress: string,
  height: number = BLOCKCHAIN_PARAMS.testHeight
) {
  // Note: This demonstrates the pattern
  // Real usage requires proper Box objects with all fields
  
  const outputBuilder = new OutputBuilder(amount, recipient);
  
  console.log(`
📦 Simple Transfer Pattern:
   From: ${inputs.length} input(s)
   To: ${recipient.slice(0, 20)}...
   Amount: ${Number(amount) / 1e9} ERG
   Height: ${height}
  `);
  
  return outputBuilder;
}

// ============================================================
// PATTERN 2: Multi-Output Transaction
// ============================================================

/**
 * Creates a transaction with multiple outputs
 * 
 * Fleet SDK pattern:
 * ```
 * .to([
 *   new OutputBuilder(1000000n, address1),
 *   new OutputBuilder(2000000n, address2)
 * ])
 * ```
 */
export function buildMultiOutput(
  recipients: Array<{ address: string; amount: bigint }>,
  height: number = BLOCKCHAIN_PARAMS.testHeight
) {
  const outputs = recipients.map(r => 
    new OutputBuilder(r.amount, r.address, height)
  );
  
  console.log(`
📦 Multi-Output Pattern:
   Recipients: ${outputs.length}
   Total: ${recipients.reduce((s, r) => s + r.amount, 0n)} nanoERG
  `);
  
  return outputs;
}

// ============================================================
// PATTERN 3: Token Transfer
// ============================================================

/**
 * Sends tokens along with ERG
 * 
 * Fleet SDK pattern:
 * ```
 * new OutputBuilder(1000000n, address)
 *   .addTokens([
 *     { tokenId: "...", amount: 100n },
 *     { tokenId: "...", amount: 429n }
 *   ])
 * ```
 */
export function buildTokenTransfer(
  recipient: string,
  tokens: Array<{ tokenId: string; amount: bigint }>,
  ergAmount: bigint = SAFE_MIN_BOX_VALUE
) {
  const output = new OutputBuilder(ergAmount, recipient)
    .addTokens(tokens);
  
  console.log(`
🪙 Token Transfer Pattern:
   To: ${recipient.slice(0, 20)}...
   ERG: ${Number(ergAmount) / 1e9}
   Tokens: ${tokens.length} type(s)
  `);
  
  return output;
}

// ============================================================
// PATTERN 4: NFT Minting (EIP-4 Standard)
// ============================================================

/**
 * Mints an NFT following EIP-4 standard
 * 
 * Fleet SDK pattern:
 * ```
 * new OutputBuilder(1000000n, address)
 *   .mintToken({
 *     name: "My NFT",
 *     amount: 1n,
 *     decimals: 0,
 *     description: "A unique NFT"
 *   })
 * ```
 */
export function buildNFTMint(
  recipient: string,
  nftMetadata: {
    name: string;
    description?: string;
  },
  height: number = BLOCKCHAIN_PARAMS.testHeight
) {
  const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, recipient, height)
    .mintToken({
      name: nftMetadata.name,
      amount: 1n,  // NFTs always have amount = 1
      decimals: 0, // NFTs always have decimals = 0
      description: nftMetadata.description || ""
    });
  
  console.log(`
🎨 NFT Minting Pattern:
   Name: ${nftMetadata.name}
   To: ${recipient.slice(0, 20)}...
   Amount: 1 (unique)
  `);
  
  return output;
}

// ============================================================
// PATTERN 5: Fungible Token Minting
// ============================================================

/**
 * Mints a fungible token with decimals
 * 
 * Fleet SDK pattern from README:
 * ```
 * .mintToken({
 *   name: "TestToken",
 *   amount: 21000000n,
 *   decimals: 4,
 *   description: "Just a test token"
 * })
 * ```
 */
export function buildTokenMint(
  recipient: string,
  tokenInfo: {
    name: string;
    amount: bigint;
    decimals: number;
    description?: string;
  }
) {
  const output = new OutputBuilder(SAFE_MIN_BOX_VALUE, recipient)
    .mintToken({
      name: tokenInfo.name,
      amount: tokenInfo.amount,
      decimals: tokenInfo.decimals,
      description: tokenInfo.description || ""
    });
  
  console.log(`
🪙 Token Minting Pattern:
   Name: ${tokenInfo.name}
   Supply: ${tokenInfo.amount}
   Decimals: ${tokenInfo.decimals}
  `);
  
  return output;
}

// ============================================================
// PATTERN 6: Token Burning
// ============================================================

/**
 * Burns tokens by not including them in outputs
 * 
 * Fleet SDK pattern:
 * ```
 * .burnTokens([
 *   { tokenId: "...", amount: 100n },
 *   { tokenId: "...", amount: 429n }
 * ])
 * .configure(settings => settings.allowTokenBurning(true))
 * ```
 */
export function calculateBurnAmount(
  inputTokens: Array<{ tokenId: string; amount: bigint }>,
  outputTokens: Array<{ tokenId: string; amount: bigint }>
): Array<{ tokenId: string; burned: bigint }> {
  const burned: Array<{ tokenId: string; burned: bigint }> = [];
  
  for (const input of inputTokens) {
    const output = outputTokens.find(o => o.tokenId === input.tokenId);
    const outputAmount = output?.amount || 0n;
    
    if (input.amount > outputAmount) {
      burned.push({
        tokenId: input.tokenId,
        burned: input.amount - outputAmount
      });
    }
  }
  
  return burned;
}

// ============================================================
// PATTERN 7: Box with Additional Registers
// ============================================================

/**
 * Creates output with custom data in registers
 * 
 * Registers R4-R9 can hold arbitrary data:
 * - R4: Often used for token name/metadata
 * - R5: Often used for description
 * - R6: Often used for decimals or other numeric data
 */
export function buildBoxWithRegisters(
  recipient: string,
  amount: bigint,
  registers: {
    R4?: string;
    R5?: string;
    R6?: string;
    R7?: string;
    R8?: string;
    R9?: string;
  }
) {
  const output = new OutputBuilder(amount, recipient)
    .setAdditionalRegisters(registers);
  
  const usedRegisters = Object.keys(registers).length;
  
  console.log(`
📋 Box with Registers Pattern:
   Amount: ${Number(amount) / 1e9} ERG
   Registers used: ${usedRegisters}
  `);
  
  return output;
}

// ============================================================
// PATTERN 8: Fee Calculation
// ============================================================

/**
 * Calculates appropriate transaction fee
 * 
 * Standard Ergo fee: RECOMMENDED_MIN_FEE_VALUE (1.1 mERG)
 * For complex transactions, multiply by number of inputs/outputs
 */
export function calculateFee(
  numInputs: number,
  numOutputs: number,
  complexity: "simple" | "medium" | "complex" = "simple"
): bigint {
  let multiplier = 1n;
  
  switch (complexity) {
    case "simple":
      multiplier = 1n;
      break;
    case "medium":
      multiplier = 2n;
      break;
    case "complex":
      multiplier = BigInt(Math.max(numInputs, numOutputs));
      break;
  }
  
  return RECOMMENDED_MIN_FEE_VALUE * multiplier;
}

// ============================================================
// PATTERN 9: Change Calculation
// ============================================================

/**
 * Calculates change for a transaction
 * 
 * change = sum(inputs) - sum(outputs) - fee
 */
export function calculateChange(
  inputTotal: bigint,
  outputTotal: bigint,
  fee: bigint
): { change: bigint; isValid: boolean } {
  const change = inputTotal - outputTotal - fee;
  
  return {
    change,
    isValid: change >= SAFE_MIN_BOX_VALUE || change === 0n
  };
}

// ============================================================
// PATTERN 10: Address Validation
// ============================================================

/**
 * Validates Ergo address format
 */
export function validateAddress(address: string): {
  isValid: boolean;
  type: "P2PK" | "P2S" | "P2SH" | "unknown";
  network: "mainnet" | "testnet" | "unknown";
} {
  try {
    const ergoAddress = ErgoAddress.fromBase58(address);
    const ergoTree = ergoAddress.ergoTree;
    
    // Determine address type by ErgoTree prefix
    let type: "P2PK" | "P2S" | "P2SH" | "unknown" = "unknown";
    if (ergoTree.startsWith("0008cd")) {
      type = "P2PK";
    } else if (ergoTree.startsWith("10")) {
      type = "P2S";
    }
    
    // Determine network by address prefix
    let network: "mainnet" | "testnet" | "unknown" = "unknown";
    if (address.startsWith("9")) {
      network = "mainnet";
    } else if (address.startsWith("3")) {
      network = "testnet";
    }
    
    return { isValid: true, type, network };
  } catch {
    return { isValid: false, type: "unknown", network: "unknown" };
  }
}

// ============================================================
// DEMO EXECUTION
// ============================================================

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🚀 Fleet SDK Advanced Patterns Demo\n");
  console.log("=".repeat(50));
  
  // Demo 1: Simple Transfer
  buildSimpleTransfer(
    [{ boxId: "abc123", value: 10_000_000_000n, ergoTree: TEST_ADDRESSES.alice.ergoTree }],
    TEST_ADDRESSES.bob.address,
    1_000_000_000n,
    TEST_ADDRESSES.alice.address
  );
  
  // Demo 2: Multi-Output
  buildMultiOutput([
    { address: TEST_ADDRESSES.bob.address, amount: 1_000_000_000n },
    { address: TEST_ADDRESSES.charlie.address, amount: 2_000_000_000n }
  ]);
  
  // Demo 3: Token Transfer
  buildTokenTransfer(
    TEST_ADDRESSES.bob.address,
    [{ tokenId: SIGMA_USD_TOKENS.sigUSD, amount: 100n }]
  );
  
  // Demo 4: NFT Mint
  buildNFTMint(
    TEST_ADDRESSES.alice.address,
    { name: "My Ergo NFT", description: "A unique collectible" }
  );
  
  // Demo 5: Token Mint
  buildTokenMint(
    TEST_ADDRESSES.alice.address,
    { name: "MyToken", amount: 1_000_000n, decimals: 2, description: "My fungible token" }
  );
  
  // Demo 6: Address Validation
  console.log("\n📍 Address Validation:");
  console.log("  Alice:", validateAddress(TEST_ADDRESSES.alice.address));
  console.log("  Fee Contract:", validateAddress("2iHkR7CWv..."));
  
  console.log("\n" + "=".repeat(50));
  console.log("✅ All patterns demonstrated successfully!");
}
