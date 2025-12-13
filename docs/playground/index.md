# 🎮 Fleet SDK Playground

> Interactive examples to learn Fleet SDK

<script setup>
import { ref } from 'vue'

const selected = ref('output')
const output = ref('// Click ▶ Run to execute')
const xp = ref(0)

const ex = {
  output: {
    name: '📦 Output',
    code: `// OutputBuilder Example
const address = "9gNvAv97...";
const amount = 1000000000n;

const output = {
  value: amount,
  address: address,
  assets: []
};

console.log("✅ Output created!");`,
    out: `✅ Output created!
Value: 1000000000n nanoERG
Address: 9gNvAv97...

+10 XP 🎮`
  },
  tx: {
    name: '🔄 Transaction',
    code: `// TransactionBuilder Example
const tx = {
  inputs: [inputBox],
  outputs: [
    { value: "1 ERG", to: recipient },
    { value: "3.99 ERG", to: sender }
  ],
  fee: "0.0011 ERG"
};

console.log("✅ Tx built!");`,
    out: `✅ Transaction built!
Inputs: 1
Outputs: 2
Fee: 0.0011 ERG

+20 XP 🎮`
  },
  token: {
    name: '🪙 Token',
    code: `// Token Transfer Example
const output = {
  value: "0.001 ERG",
  address: recipient,
  tokens: [{
    id: "03faf2cb...",
    amount: 100
  }]
};

console.log("✅ Token output!");`,
    out: `✅ Token output created!
Token: 03faf2cb...
Amount: 100 tokens

+15 XP 🎮`
  },
  nft: {
    name: '🖼️ NFT',
    code: `// NFT Minting (EIP-4)
const nft = {
  amount: 1,
  name: "My NFT",
  desc: "Unique artwork",
  type: "image/png",
  url: "ipfs://Qm..."
};

console.log("✅ NFT ready!");`,
    out: `✅ NFT ready to mint!
Name: My NFT
Description: Unique artwork
Type: image/png

+25 XP 🎮`
  },
  box: {
    name: '📦 Box',
    code: `// Ergo Box (UTXO)
const box = {
  id: "e56847ed...",
  value: "1.5 ERG",
  tokens: 1,
  registers: { R4: "data" },
  height: 1199500
};

console.log("📦 Box info:");`,
    out: `📦 Box Structure:
ID: e56847ed...
Value: 1.5 ERG
Tokens: 1
Registers: 1

+20 XP 🎮`
  }
}

function run() {
  output.value = ex[selected.value].out
  const m = ex[selected.value].out.match(/\+(\d+)/)
  if (m) xp.value += parseInt(m[1])
}

function pick(k) {
  selected.value = k
  output.value = '// Click ▶ Run to execute'
}
</script>

<div class="pg">
  <div class="tabs">
    <button v-for="(e, k) in ex" :key="k" :class="{act: selected===k}" @click="pick(k)">{{e.name}}</button>
  </div>
  <div class="grid">
    <div class="box">
      <div class="hdr"><span>📝 Code</span><button class="run" @click="run">▶ Run</button></div>
      <pre class="code">{{ex[selected].code}}</pre>
    </div>
    <div class="box">
      <div class="hdr"><span>📤 Output</span><span class="xp">🏆 {{xp}} XP</span></div>
      <pre class="out">{{output}}</pre>
    </div>
  </div>
</div>

<style scoped>
.pg { margin: 24px 0; }
.tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.tabs button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 14px;
}
.tabs button:hover { border-color: #10b981; color: #10b981; }
.tabs button.act { background: #10b981; color: white; border-color: #10b981; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 700px) { .grid { grid-template-columns: 1fr; } }
.box { border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; }
.hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 600;
}
.run {
  background: #10b981;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
.run:hover { background: #059669; }
.xp {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #000;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
}
.code, .out {
  margin: 0;
  padding: 16px;
  font-family: 'Fira Code', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  min-height: 220px;
  max-height: 280px;
  overflow: auto;
  background: #1e1e1e;
  color: #d4d4d4;
  white-space: pre;
}
.out { color: #4ade80; }

:root.dark .tabs button { background: #374151; border-color: #4b5563; color: #d1d5db; }
:root.dark .tabs button.act { background: #10b981; color: white; }
:root.dark .box { border-color: #374151; }
:root.dark .hdr { background: #1f2937; border-color: #374151; color: #f3f4f6; }
</style>

---

## 🚀 Run Locally

```bash
git clone https://github.com/ayushap18/fleet-sdk-tutorial.git
cd fleet-sdk-tutorial
npm install
npm test  # 86 tests
```

## 📚 Learn More

| Link | Description |
|------|-------------|
| [First Transaction](/tutorials/01-first-transaction) | Step-by-step tutorial |
| [Cheat Sheet](/guides/cheatsheet) | Quick reference |
| [Examples](/examples/) | More code examples |
