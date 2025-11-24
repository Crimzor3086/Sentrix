# Contract Deployment Summary

## ✅ Contracts Created

1. **IPAssetRegistry.sol** - Registry for IP Assets
   - Registers IP assets with IPFS hashes
   - Tracks creators and their assets
   - Emits `IPRegistered` events

2. **LicensingModule.sol** - License Management
   - Creates licenses for IP assets
   - Handles license purchases with payments
   - Emits `LicenseCreated` and `LicensePurchased` events

## 📝 Deployment Steps

### 1. Configure Environment

Create `contracts/.env`:
```env
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
PRIVATE_KEY=your-private-key-with-testnet-eth
```

### 2. Deploy Contracts

```bash
cd contracts
npm install
npm run compile
npm run deploy:arbitrum-sepolia
```

### 3. Update Backend Configuration

After deployment, update `backend/.env`:

```env
STORY_IP_ASSET_REGISTRY_ADDRESS=<deployed-address>
STORY_LICENSING_MODULE_ADDRESS=<deployed-address>
STORY_CHAIN_ID=421614
STORY_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
STORY_PRIVATE_KEY=<your-deployment-key>
```

## 🔄 Backend Integration

The backend has been updated to:

1. **Interact with deployed contracts** via viem
2. **Register IP Assets** on-chain when created
3. **Create licenses** with terms stored on IPFS
4. **Purchase licenses** with payment handling
5. **Sync events** from contracts to database

## 📊 Event Syncing

The sync worker now:
- Fetches `IPRegistered` events from IPAssetRegistry
- Fetches `LicenseCreated` and `LicensePurchased` events from LicensingModule
- Stores events in `story_events` table
- Processes events to update IP Assets and Licenses

## 🧪 Testing

After deployment:

1. **Test IP Registration**:
   ```bash
   POST /ip/register
   # Should register on-chain and return IP ID
   ```

2. **Test License Creation**:
   ```bash
   POST /license/create
   # Should create license on-chain
   ```

3. **Test License Purchase**:
   ```bash
   POST /license/purchase
   # Should purchase license with payment
   ```

4. **Verify Events**:
   - Check `story_events` table for synced events
   - Verify IP Assets and Licenses are updated

## 📍 Contract Addresses

Deployment addresses are saved in:
- `contracts/deployments/arbitrumSepolia-421614.json`

## 🔍 Verification

To verify contracts on Arbiscan:

```bash
npx hardhat verify --network arbitrumSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## ⚠️ Important Notes

1. **Private Key Security**: Never commit private keys to git
2. **Testnet Only**: Contracts are deployed to Arbitrum Sepolia testnet
3. **Gas Fees**: Ensure deployment account has testnet ETH
4. **Contract Ownership**: Contracts are owned by deployer address

## 🚀 Next Steps

1. Deploy contracts to Arbitrum Sepolia
2. Update backend `.env` with contract addresses
3. Restart backend server
4. Test IP registration via API
5. Test license creation and purchase
6. Verify events are syncing correctly

