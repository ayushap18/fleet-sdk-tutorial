import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Fleet SDK Tutorial',
  description: 'Master Ergo blockchain development with Fleet SDK',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Concepts', link: '/concepts/' },
      { text: 'Tutorials', link: '/tutorials/01-first-transaction' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Playground', link: '/playground/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'Architecture', link: '/architecture/' },
      { text: 'Testing', link: '/testing/' },
      {
        text: 'Resources',
        items: [
          { text: 'Troubleshooting', link: '/troubleshooting/common-issues' },
          { text: 'Fleet SDK Docs', link: 'https://fleet-sdk.github.io/docs/' },
          { text: 'Ergo Platform', link: 'https://ergoplatform.com/' },
          { text: 'Testnet Faucet', link: 'https://testnet.ergoplatform.com/en/faucet/' },
          { text: 'GitHub Repo', link: 'https://github.com/fleet-sdk/fleet' },
        ]
      }
    ],

    sidebar: {
      '/tutorials/': [
        {
          text: '🎓 Tutorials',
          items: [
            { text: '01. First Transaction', link: '/tutorials/01-first-transaction' },
            { text: '02. Token Operations', link: '/tutorials/02-token-operations' },
            { text: '03. NFT Minting', link: '/tutorials/03-nft-minting' },
            { text: '04. Smart Contracts', link: '/tutorials/04-smart-contracts' },
          ]
        },
        {
          text: '📖 Concepts',
          items: [
            { text: 'Overview', link: '/concepts/' },
            { text: 'UTXO Model', link: '/concepts/utxo-model' },
            { text: 'Box Structure', link: '/concepts/box-structure' },
            { text: 'ErgoScript Basics', link: '/concepts/ergoscript' },
            { text: 'Data Inputs', link: '/concepts/data-inputs' },
            { text: 'Compile Time Constants', link: '/concepts/compile-time-constants' },
            { text: 'Reduced Tx & ErgoPay', link: '/concepts/reduced-tx-ergopay' },
          ]
        }
      ],
      '/concepts/': [
        {
          text: '📖 Core Concepts',
          items: [
            { text: 'Overview', link: '/concepts/' },
            { text: 'UTXO Model', link: '/concepts/utxo-model' },
            { text: 'Box Structure', link: '/concepts/box-structure' },
            { text: 'ErgoScript Basics', link: '/concepts/ergoscript' },
            { text: 'Data Inputs', link: '/concepts/data-inputs' },
            { text: 'Compile Time Constants', link: '/concepts/compile-time-constants' },
            { text: 'Reduced Tx & ErgoPay', link: '/concepts/reduced-tx-ergopay' },
          ]
        }
      ],
      '/examples/': [
        {
          text: '💻 Code Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Basic Transfer', link: '/examples/basic-transfer' },
            { text: 'Multi-Output', link: '/examples/multi-output' },
            { text: 'Token Transfer', link: '/examples/token-transfer' },
            { text: 'NFT Minting', link: '/examples/nft-minting' },
            { text: 'Contract Interaction', link: '/examples/contract-interaction' },
            { text: 'Multi-Sig Wallet', link: '/examples/multi-sig' },
            { text: 'Oracle Data', link: '/examples/oracle-data' },
            { text: 'DeFi Swap', link: '/examples/defi-swap' },
            { text: '🔒 Time-Lock', link: '/examples/timelock' },
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: '🐛 Troubleshooting',
          items: [
            { text: 'Common Issues', link: '/troubleshooting/common-issues' },
          ]
        }
      ],
      '/playground/': [
        {
          text: '🎮 Playground',
          items: [
            { text: 'Live Playground', link: '/playground/' },
          ]
        }
      ],
      '/guides/': [
        {
          text: '📚 Guides',
          items: [
            { text: 'Overview', link: '/guides/' },
            { text: 'Testnet Integration', link: '/guides/testnet-integration' },
            { text: 'XP & Achievements', link: '/guides/leaderboard' },
            { text: '📋 Cheat Sheet', link: '/guides/cheatsheet' },
          ]
        }
      ],
      '/architecture/': [
        {
          text: '🏗️ Architecture',
          items: [
            { text: 'System Overview', link: '/architecture/' },
          ]
        }
      ],
      '/testing/': [
        {
          text: '🧪 Testing',
          items: [
            { text: 'Testing Guide', link: '/testing/' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fleet-sdk/fleet' },
      { icon: 'discord', link: 'https://discord.gg/ergo-platform' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Fleet SDK Contributors'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/fleet-sdk/docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    }
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
