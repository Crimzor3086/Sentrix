# Contract Deployment Guide

## Prerequisites

1. **Node.js** 20+
2. **Hardhat** (installed via npm)
3. **Ethereum wallet** with testnet ETH
4. **RPC endpoint** (Infura, Alchemy, or public)

## Setup

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Configure Environment

Create `.env` file in `contracts/` directory:

```env
# Network RPC URLs
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
# Or use Alchemy/Infura
# ARBITRUM_SEPOLIA_RPC_URL=https://arb-sepolia.g.alchemy.com/v2/YOUR_KEY

# Private Key (for deployment)
PRIVATE_KEY=your-private-key-here

# Optional: For contract verification
ARBISCAN_API_KEY=your-arbiscan-api-key
```

### 3. Compile Contracts

```bash
npm run compile
```

## Deployment

### Deploy to Arbitrum Sepolia (Recommended for Story Protocol)

```bash
npm run deploy:arbitrum-sepolia
```

This will:
1. Deploy `IPAssetRegistry` contract
2. Deploy `LicensingModule` contract
3. Save deployment addresses to `deployments/` directory
4. Print addresses to console

### Deploy to Local Network (Testing)

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy
npm run deploy:local
```

## Update Backend Configuration

After deployment, update `backend/.env`:

```env
STORY_IP_ASSET_REGISTRY_ADDRESS=<deployed-address>
STORY_LICENSING_MODULE_ADDRESS=<deployed-address>
STORY_CHAIN_ID=421614
STORY_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
STORY_PRIVATE_KEY=<your-deployment-private-key>
```

## Verify Contracts (Optional)

After deployment, verify on Arbiscan:

```bash
npx hardhat verify --network arbitrumSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
# Verify IPAssetRegistry
npx hardhat verify --network arbitrumSepolia <IP_ASSET_REGISTRY_ADDRESS> <OWNER_ADDRESS>

# Verify LicensingModule
npx hardhat verify --network arbitrumSepolia <LICENSING_MODULE_ADDRESS> <IP_ASSET_REGISTRY_ADDRESS> <OWNER_ADDRESS>
```

## Contract Addresses

Deployment addresses are saved in:
- `contracts/deployments/<network>-<chainId>.json`

Example:
```json
{
  "network": "arbitrumSepolia",
  "chainId": "421614",
  "deployer": "0x...",
  "contracts": {
    "IPAssetRegistry": "0x...",
    "LicensingModule": "0x..."
  }
}
```

## Testing

After deployment, test the contracts:

1. **Register an IP Asset**:
   - Call `registerIPAsset(ipfsHash, metadataHash)` on IPAssetRegistry
   - Get IP ID from event

2. **Create a License**:
   - Call `createLicense(ipId, termsHash, price, ...)` on LicensingModule
   - Get License ID from event

3. **Purchase a License**:
   - Call `purchaseLicense(licenseId, certificateHash)` with payment
   - License becomes active

## Troubleshooting

### Deployment Fails

- Check you have enough ETH for gas
- Verify RPC URL is correct
- Ensure private key has funds

### Contract Verification Fails

- Check constructor arguments match deployment
- Verify network and chain ID
- Ensure contract is deployed on correct network

### Events Not Syncing

- Verify contract addresses in backend `.env`
- Check RPC URL is accessible
- Ensure contracts are deployed and events are emitted

## Next Steps

1. Update backend `.env` with deployed addresses
2. Restart backend server
3. Test IP registration via API
4. Test license creation and purchase
5. Verify events are syncing to database

