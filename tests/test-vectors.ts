/**
 * Authentic Test Vectors from Fleet SDK
 * 
 * These are real boxes, transactions, and addresses from the
 * Fleet SDK repository: https://github.com/fleet-sdk/fleet
 * 
 * Using these ensures our tutorials match production patterns.
 */

import type { Box } from "@fleet-sdk/common";

// ============================================================
// REAL BOX DATA (From Fleet SDK _test-vectors/mockedBoxes.ts)
// ============================================================

/**
 * Regular boxes used in Fleet SDK tests
 * These are based on real mainnet data
 */
export const regularBoxes: Box<bigint>[] = [
  {
    boxId: "e56847ed19b3dc6b72828fcfb992fdf7310828cf291221269b7ffc72fd66706e",
    value: 67500000000n,
    ergoTree: "100204a00b08cd021dde34603426402615658f1d970cfa7c7bd92ac81a8b16eeebff264d59ce4604ea02d192a39a8cc7a70173007301",
    assets: [],
    creationHeight: 284761,
    additionalRegisters: {},
    transactionId: "9148408c04c2e38a6402a7950d6157730fa7d49e9ab3b9cadec481d7769918e9",
    index: 1
  },
  {
    boxId: "3e67b4be7012956aa369538b46d751a4ad0136138760553d5400a10153046e52",
    value: 1000000000n,
    ergoTree: "0008cd038d39af8c37583609ff51c6a577efe60684119da2fbd0d75f9c72372886a58a63",
    assets: [
      {
        tokenId: "007fd64d1ee54d78dd269c8930a38286caa28d3f29d27cadcb796418ab15c283",
        amount: 10000n
      }
    ],
    creationHeight: 805063,
    additionalRegisters: {},
    transactionId: "f82fa15166d787c275a6a5ab29983f6386571c63e50c73c1af7cba184f85ef23",
    index: 0
  },
  {
    boxId: "2555e34138d276905fe0bc19240bbeca10f388a71f7b4d2f65a7d0bfd23c846d",
    value: 1000000000n,
    ergoTree: "0008cd038d39af8c37583609ff51c6a577efe60684119da2fbd0d75f9c72372886a58a63",
    assets: [
      {
        tokenId: "0cd8c9f416e5b1ca9f986a7f10a84191dfb85941619e49e53c0dc30ebf83324b",
        amount: 10n
      }
    ],
    creationHeight: 804138,
    additionalRegisters: {},
    transactionId: "fda281aa2e87c121e0f1db4feebc845f5e2ffc1c60dae40db81fb11e4766fb0b",
    index: 0
  }
];

/**
 * Boxes with many tokens (stress test)
 * From Fleet SDK tests for token handling
 */
export const manyTokensBoxes: Box<bigint>[] = [
  {
    boxId: "490148afdc36f5459bbfd84922a446abea9a1077e031822f377b0ff3a6e467e3",
    value: 1100000n,
    ergoTree: "0008cd038d39af8c37583609ff51c6a577efe60684119da2fbd0d75f9c72372886a58a63",
    creationHeight: 856505,
    additionalRegisters: {},
    transactionId: "dd04d6c912bc87f73aa5cc0f6d71a663ec12f07e8c3201374f1d641bfbcc2ce5",
    index: 0,
    assets: [
      {
        tokenId: "31d6f93435540f52f067efe2c5888b8d4c4418a4fd28156dd834102c8336a804",
        amount: 1n
      },
      {
        tokenId: "8565b6d9b72d0cb8ca052f7e5b8cdf32905333b9e026162e3a6d585ae78e697b",
        amount: 1n
      },
      {
        tokenId: "0cd8c9f416e5b1ca9f986a7f10a84191dfb85941619e49e53c0dc30ebf83324b",
        amount: 5n
      }
    ]
  }
];

// ============================================================
// REAL TOKEN IDS (From Fleet SDK and SigmaUSD)
// ============================================================

export const REAL_TOKENS = {
  // SigmaUSD Protocol Tokens
  sigUSD: {
    tokenId: "03faf2cb329f2e90d6d23b58d91bbb6c046aa143261cc21f52fbe2824bfcbf04",
    name: "SigUSD",
    decimals: 2
  },
  sigRSV: {
    tokenId: "003bd19d0187117f130b62e1bcab0939929ff5c7709f843c5c4dd158949285d0",
    name: "SigRSV",
    decimals: 0
  },
  bankNFT: {
    tokenId: "7d672d1def471720ca5782fd6473e47e796d9ac0c138d9911346f118b2f6d9d9",
    name: "SUSD Bank V2 NFT",
    decimals: 0
  },
  
  // Oracle Pool NFT
  oracleNFT: {
    tokenId: "011d3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6eda887f",
    name: "Oracle Pool NFT",
    decimals: 0
  },
  
  // Test Tokens from Fleet SDK
  testToken1: {
    tokenId: "0cd8c9f416e5b1ca9f986a7f10a84191dfb85941619e49e53c0dc30ebf83324b",
    name: "Test Token 1",
    decimals: 0
  },
  testToken2: {
    tokenId: "007fd64d1ee54d78dd269c8930a38286caa28d3f29d27cadcb796418ab15c283",
    name: "Test Token 2",
    decimals: 0
  }
};

// ============================================================
// REAL ADDRESSES (From Fleet SDK Test Vectors)
// ============================================================

export const REAL_ADDRESSES = {
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

// ============================================================
// BLOCKCHAIN PARAMETERS (From Ergo Mainnet at height 1283632)
// ============================================================

export const BLOCKCHAIN_PARAMETERS = {
  storageFeeFactor: 1250000,
  minValuePerByte: 360,
  maxBlockSize: 1271009,
  tokenAccessCost: 100,
  inputCost: 2407,
  dataInputCost: 100,
  outputCost: 197,
  maxBlockCost: 8001091,
  blockVersion: 3
};

// ============================================================
// FEE CONTRACT (Standard Ergo Miner Fee)
// ============================================================

export const FEE_CONTRACT = "1005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a57304";

// ============================================================
// SIGMAUSD BANK BOX (Real Protocol Data)
// ============================================================

export const SIGMA_USD_BANK = {
  contract: "102a0400040004000e20011d3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6eda887f0400040204020400040004020500050005c8010500050005feffffffffffffffff0105000580897a05000580897a040405c80104c0933805c00c0580a8d6b907050005c8010580dac40905000500040404040500050005a0060101050005a0060100040004000e20239c170b7e82f94e6b05416f14b8a",
  
  // Example bank box state (for testing)
  exampleBox: {
    value: 1477201069508651n,
    tokens: [
      { tokenId: REAL_TOKENS.sigUSD.tokenId, amount: 9839597806n },
      { tokenId: REAL_TOKENS.sigRSV.tokenId, amount: 8624561026n },
      { tokenId: REAL_TOKENS.bankNFT.tokenId, amount: 1n }
    ],
    // R4: circulating stable, R5: circulating reserve
    registers: {
      R4: "0584cda232",    // Circulating SigUSD
      R5: "05acdac7e612"   // Circulating SigRSV
    }
  }
};

// ============================================================
// ORACLE BOX (Real Protocol Data)
// ============================================================

export const ORACLE = {
  contract: "1014040004000e208c27dd9d8a35aac1e3167d58858c0a8b4059b277da790552e37eba22df9b903504000400040204020101040205a0c21e040204080500040c040204a0c21e0402050a05c8010402d806d601b2a5730000d602b5db6501fed9010263ed93e4c6720205",
  
  // Example oracle rate
  exampleRate: 210526315n, // nanoERG per cent of USD
  
  // Example oracle box
  exampleBox: {
    value: 5475000000n,
    tokens: [{ tokenId: REAL_TOKENS.oracleNFT.tokenId, amount: 1n }],
    registers: {
      R4: "05b8e68b8106" // Oracle rate
    }
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate sum of box values
 */
export function sumBoxValues(boxes: Box<bigint>[]): bigint {
  return boxes.reduce((sum, box) => sum + box.value, 0n);
}

/**
 * Filter boxes by minimum value
 */
export function filterByMinValue(boxes: Box<bigint>[], minValue: bigint): Box<bigint>[] {
  return boxes.filter(box => box.value >= minValue);
}

/**
 * Get boxes containing a specific token
 */
export function getBoxesWithToken(boxes: Box<bigint>[], tokenId: string): Box<bigint>[] {
  return boxes.filter(box => 
    box.assets.some(asset => asset.tokenId === tokenId)
  );
}

/**
 * Calculate total of a specific token across boxes
 */
export function sumTokenAmount(boxes: Box<bigint>[], tokenId: string): bigint {
  return boxes.reduce((sum, box) => {
    const token = box.assets.find(a => a.tokenId === tokenId);
    return sum + (token?.amount || 0n);
  }, 0n);
}

// ============================================================
// EXPORT ALL
// ============================================================

export default {
  regularBoxes,
  manyTokensBoxes,
  REAL_TOKENS,
  REAL_ADDRESSES,
  BLOCKCHAIN_PARAMETERS,
  FEE_CONTRACT,
  SIGMA_USD_BANK,
  ORACLE,
  sumBoxValues,
  filterByMinValue,
  getBoxesWithToken,
  sumTokenAmount
};
