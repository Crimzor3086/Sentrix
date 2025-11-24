# Sentrix Smart Contracts

Smart contracts for IP Asset registration and licensing on Sentrix.

## Contracts

- **IPAssetRegistry**: Registry for IP Assets with IPFS hash storage
- **LicensingModule**: Handles license creation and purchases

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit with your configuration
```

3. Compile contracts:
```bash
npm run compile
```

## Deployment

### Deploy to Arbitrum Sepolia (Story Protocol)

```bash
npm run deploy:sepolia
```

Make sure your `.env` has:
- `ARBITRUM_SEPOLIA_RPC_URL` or use default
- `PRIVATE_KEY` with deployment account

### Deploy to Local Network

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npm run deploy:local
```

## Verification

After deployment, verify contracts on block explorer:

```bash
npm run verify
```

## Update Backend

After deployment, update `backend/.env`:

```env
STORY_IP_ASSET_REGISTRY_ADDRESS=<deployed-address>
STORY_LICENSING_MODULE_ADDRESS=<deployed-address>
```

Deployment addresses are saved in `deployments/` directory.

