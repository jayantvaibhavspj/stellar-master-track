# StellarFlow Mainnet

A Level 7 product scaffold for building StellarFlow on Stellar Mainnet.

## What this is
This folder contains starter files for the next product in your Stellar journey: a mainnet-ready payment streaming app built with React and Soroban.

## Product goal
- Launch on Stellar Mainnet
- Onboard 50+ users
- Provide real-time payment streams
- Add analytics, feedback, and growth-proof documentation

## How to use this scaffold
1. Install dependencies
   ```bash
   cd stellarflow-mainnet
   npm install
   ```
2. Start local development
   ```bash
   npm run dev
   ```
3. Build production app
   ```bash
   npm run build
   ```

## Files included
- `package.json` — dependencies and scripts
- `frontend/index.html` — base HTML
- `frontend/src/main.jsx` — React app entrypoint
- `frontend/src/App.jsx` — starter UI
- `frontend/src/styles.css` — basic styling

## Next product work
- Expand Soroban mainnet contract integration and deploy a live contract
- Expand wallet onboarding to support Lobstr and xBull
- Add payment stream creation and history screens
- Add analytics dashboard and feedback form
- Deploy to Vercel and record mainnet proof

## Wallet onboarding and contract flow
The starter UI includes:
- Freighter wallet onboarding for testnet and mainnet
- Public key display and balance loading
- Contract status check for a placeholder contract account
- Prepare and sign a stream transaction skeleton ready for contract invocation
