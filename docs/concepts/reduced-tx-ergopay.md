# 📱 Reduced Transactions & ErgoPay

> Mobile wallet integration with reduced transactions

Reduced transactions (ReducedTx) are a special transaction format that enables **ErgoPay** - Ergo's protocol for mobile wallet signing.

## What is a Reduced Transaction?

```
┌─────────────────────────────────────────────────────────────────┐
│                UNSIGNED TX vs REDUCED TX                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   UNSIGNED TRANSACTION           REDUCED TRANSACTION            │
│   ┌─────────────────────┐        ┌─────────────────────┐       │
│   │ • Full input boxes  │        │ • Minimal data      │       │
│   │ • All registers     │ ────▶  │ • Hints for signing │       │
│   │ • Complete ErgoTree │ reduce │ • Smaller payload   │       │
│   │ • Heavy payload     │        │ • Mobile-friendly   │       │
│   └─────────────────────┘        └─────────────────────┘       │
│                                                                 │
│   Best for: Desktop apps         Best for: Mobile wallets      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Why Use Reduced Transactions?

| Feature | Benefit |
|---------|---------|
| **Smaller Size** | Optimized for QR codes and mobile |
| **ErgoPay Compatible** | Works with Ergo mobile wallets |
| **Offline Signing** | Wallet doesn't need full box data |
| **Better UX** | Faster QR scanning and processing |

## ErgoPay Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                        ERGOPAY FLOW                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   1. dApp builds transaction                                       │
│      ┌──────────┐                                                  │
│      │   dApp   │                                                  │
│      │  Website │                                                  │
│      └────┬─────┘                                                  │
│           │                                                        │
│   2. Reduce transaction                                            │
│           │                                                        │
│           ▼                                                        │
│      ┌──────────┐      3. Generate ErgoPay URL                     │
│      │ Reduced  │──────────────────────────────┐                   │
│      │    Tx    │                              │                   │
│      └──────────┘                              ▼                   │
│                                         ┌────────────┐             │
│                                         │  ergopay:// │            │
│                                         │    URL      │            │
│   4. Display QR Code                    └──────┬─────┘             │
│      ┌──────────┐                              │                   │
│      │ ▄▄▄▄▄▄▄▄ │                              │                   │
│      │ █ QR  █ │◀─────────────────────────────┘                   │
│      │ ▀▀▀▀▀▀▀▀ │                                                  │
│      └────┬─────┘                                                  │
│           │                                                        │
│   5. Scan with mobile wallet                                       │
│           ▼                                                        │
│      ┌──────────┐                                                  │
│      │ 📱 Ergo  │      6. Sign & Submit                            │
│      │  Wallet  │────────────────────────▶ Blockchain              │
│      └──────────┘                                                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Creating a Reduced Transaction

```typescript
import { 
  TransactionBuilder, 
  OutputBuilder,
  SAFE_MIN_BOX_VALUE 
} from "@fleet-sdk/core";

// Step 1: Build unsigned transaction
async function buildTransaction(
  inputs: Box<string>[],
  recipient: string,
  amount: string,
  changeAddress: string
) {
  const currentHeight = await getCurrentHeight();

  const unsignedTx = new TransactionBuilder(currentHeight)
    .from(inputs)
    .to(
      new OutputBuilder(amount, recipient)
    )
    .sendChangeTo(changeAddress)
    .payFee("1100000")
    .build();

  return unsignedTx;
}

// Step 2: Reduce the transaction
async function reduceTransaction(unsignedTx: any) {
  // The reduce operation creates hints for signing
  // This requires access to the blockchain for box data
  
  const reducedTx = await unsignedTx.reduce({
    // Provide context for reduction
    baseCost: 0,
    initCost: 0
  });

  return reducedTx;
}
```

## ErgoPay URL Format

```typescript
/**
 * ErgoPay URL format:
 * ergopay://<base64_encoded_reduced_tx>
 * 
 * Or with server callback:
 * ergopay://<server_url>/path/to/tx
 */

function createErgoPayUrl(reducedTx: ReducedTransaction): string {
  // Serialize and encode
  const serialized = reducedTx.toBytes();
  const base64 = Buffer.from(serialized).toString('base64url');
  
  return `ergopay://${base64}`;
}

// For larger transactions, use server callback
function createErgoPayCallbackUrl(txId: string): string {
  return `ergopay://your-dapp.com/api/ergopay/${txId}`;
}
```

## Complete ErgoPay Integration

```typescript
import { 
  TransactionBuilder, 
  OutputBuilder,
  ErgoAddress 
} from "@fleet-sdk/core";
import QRCode from "qrcode";

class ErgoPayService {
  private apiUrl: string;

  constructor(apiUrl: string = "https://api.ergoplatform.com") {
    this.apiUrl = apiUrl;
  }

  /**
   * Create ErgoPay payment request
   */
  async createPaymentRequest(
    recipientAddress: string,
    amountNanoErg: string,
    senderAddress: string
  ): Promise<{ qrCode: string; ergoPayUrl: string }> {
    
    // 1. Fetch sender's UTXOs
    const utxos = await this.fetchUtxos(senderAddress);
    
    // 2. Get current height
    const height = await this.getCurrentHeight();
    
    // 3. Build transaction
    const unsignedTx = new TransactionBuilder(height)
      .from(utxos)
      .to(
        new OutputBuilder(amountNanoErg, recipientAddress)
      )
      .sendChangeTo(senderAddress)
      .payFee("1100000")
      .build();

    // 4. Create ErgoPay URL (simplified - actual reduction is more complex)
    const txData = JSON.stringify(unsignedTx);
    const encoded = Buffer.from(txData).toString('base64url');
    const ergoPayUrl = `ergopay://${encoded}`;

    // 5. Generate QR code
    const qrCode = await QRCode.toDataURL(ergoPayUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300
    });

    return { qrCode, ergoPayUrl };
  }

  /**
   * Create ErgoPay URL with server callback
   * (Recommended for larger transactions)
   */
  async createCallbackRequest(
    recipientAddress: string,
    amountNanoErg: string
  ): Promise<{ qrCode: string; requestId: string }> {
    
    // Store transaction details on server
    const requestId = crypto.randomUUID();
    
    // Server endpoint that returns reduced tx
    const callbackUrl = `ergopay://your-dapp.com/api/ergopay/${requestId}`;
    
    const qrCode = await QRCode.toDataURL(callbackUrl);

    return { qrCode, requestId };
  }

  private async fetchUtxos(address: string) {
    const response = await fetch(
      `${this.apiUrl}/api/v1/boxes/unspent/byAddress/${address}`
    );
    const data = await response.json() as { items: any[] };
    return data.items;
  }

  private async getCurrentHeight(): Promise<number> {
    const response = await fetch(`${this.apiUrl}/api/v1/networkState`);
    const data = await response.json() as { height: number };
    return data.height;
  }
}
```

## Server-Side ErgoPay Endpoint

```typescript
// Express.js example
import express from "express";

const app = express();

// Store pending transactions
const pendingTxs = new Map<string, any>();

// Endpoint to create payment request
app.post("/api/ergopay/create", async (req, res) => {
  const { recipient, amount } = req.body;
  
  const requestId = crypto.randomUUID();
  
  // Store transaction details
  pendingTxs.set(requestId, {
    recipient,
    amount,
    createdAt: Date.now()
  });

  // Return ErgoPay URL
  res.json({
    ergoPayUrl: `ergopay://your-dapp.com/api/ergopay/${requestId}`,
    requestId
  });
});

// ErgoPay callback - wallet fetches reduced tx from here
app.get("/api/ergopay/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const { address } = req.query; // Wallet provides sender address
  
  const txDetails = pendingTxs.get(requestId);
  if (!txDetails) {
    return res.status(404).json({ error: "Request not found" });
  }

  // Build reduced transaction for this address
  const reducedTx = await buildReducedTx(
    address as string,
    txDetails.recipient,
    txDetails.amount
  );

  // Return in ErgoPay format
  res.json({
    reducedTx: reducedTx.toBase64(),
    address: txDetails.recipient,
    message: `Payment of ${txDetails.amount} nanoERG`
  });
});
```

## QR Code Component (React)

```tsx
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface ErgoPayQRProps {
  ergoPayUrl: string;
  size?: number;
}

export const ErgoPayQR: React.FC<ErgoPayQRProps> = ({ 
  ergoPayUrl, 
  size = 256 
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(ergoPayUrl, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#000000",
        light: "#ffffff"
      }
    }).then(setQrDataUrl);
  }, [ergoPayUrl, size]);

  return (
    <div className="ergopay-qr">
      {qrDataUrl && (
        <img 
          src={qrDataUrl} 
          alt="Scan with Ergo wallet"
          width={size}
          height={size}
        />
      )}
      <p>Scan with Ergo mobile wallet</p>
      <a href={ergoPayUrl} className="mobile-link">
        Open in wallet app
      </a>
    </div>
  );
};
```

## Mobile Deep Linking

```html
<!-- For mobile browsers, link directly to wallet -->
<a href="ergopay://...">
  Pay with Ergo Wallet
</a>

<!-- With fallback for desktop -->
<script>
function openErgoPayOrShowQR(ergoPayUrl) {
  // Try to open wallet
  window.location.href = ergoPayUrl;
  
  // If still here after 2 seconds, show QR
  setTimeout(() => {
    showQRCode(ergoPayUrl);
  }, 2000);
}
</script>
```

## Error Handling

```typescript
interface ErgoPayError {
  code: string;
  message: string;
}

async function handleErgoPayRequest(requestId: string) {
  try {
    const response = await fetch(`/api/ergopay/${requestId}`);
    
    if (!response.ok) {
      const error: ErgoPayError = await response.json();
      
      switch (error.code) {
        case "TX_EXPIRED":
          return { error: "Transaction expired, please try again" };
        case "INSUFFICIENT_FUNDS":
          return { error: "Insufficient funds in wallet" };
        case "INVALID_ADDRESS":
          return { error: "Invalid wallet address" };
        default:
          return { error: error.message };
      }
    }

    return await response.json();
  } catch (e) {
    return { error: "Network error, please try again" };
  }
}
```

## Best Practices

### 1. URL Length Limits

```typescript
// QR codes have size limits
// For large transactions, use callback URL instead of inline data

const MAX_INLINE_SIZE = 2000; // bytes

function createErgoPayUrl(reducedTx: ReducedTransaction): string {
  const serialized = reducedTx.toBytes();
  
  if (serialized.length > MAX_INLINE_SIZE) {
    // Use server callback
    return createCallbackUrl(reducedTx);
  }
  
  // Inline is OK
  return `ergopay://${Buffer.from(serialized).toString('base64url')}`;
}
```

### 2. Transaction Expiry

```typescript
// Set expiry for pending transactions
const TX_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function isExpired(createdAt: number): boolean {
  return Date.now() - createdAt > TX_EXPIRY_MS;
}
```

### 3. User Feedback

```typescript
// Show transaction status
type TxStatus = "pending" | "signed" | "submitted" | "confirmed" | "failed";

function renderStatus(status: TxStatus) {
  switch (status) {
    case "pending": return "⏳ Waiting for signature...";
    case "signed": return "✍️ Signed, submitting...";
    case "submitted": return "📤 Submitted to network...";
    case "confirmed": return "✅ Transaction confirmed!";
    case "failed": return "❌ Transaction failed";
  }
}
```

## Test Example

```typescript
import { describe, it, expect } from "vitest";

describe("ErgoPay", () => {
  it("should create valid ergopay URL", () => {
    const txData = { amount: "1000000000", recipient: "9f..." };
    const encoded = Buffer.from(JSON.stringify(txData)).toString("base64url");
    const url = `ergopay://${encoded}`;
    
    expect(url).toMatch(/^ergopay:\/\//);
  });

  it("should use callback for large transactions", () => {
    const largeData = "x".repeat(3000);
    const shouldUseCallback = largeData.length > 2000;
    
    expect(shouldUseCallback).toBe(true);
  });
});
```

## Supported Wallets

| Wallet | ErgoPay Support |
|--------|-----------------|
| **Ergo Wallet (Android)** | ✅ Full support |
| **Ergo Wallet (iOS)** | ✅ Full support |
| **Nautilus** | ✅ Via dApp connector |
| **SAFEW** | ⚠️ Partial |

## Next Steps

- [Data Inputs](./data-inputs) - Reference boxes without spending
- [Compile Time Constants](./compile-time-constants) - Configure contracts
- [Examples](../examples/) - Complete working examples
