# ✅ Contracts Successfully Deployed to Mantle Sepolia

## Deployment Summary

**Network**: Mantle Sepolia Testnet  
**Chain ID**: 5003  
**Deployer Address**: `0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f`  
**Deployment Date**: $(date)

## Contract Addresses

### IPAssetRegistry
```
0xAA2202d596C71e179310Df44e13324Ae716c575a
```

**Functions**:
- `registerIPAsset(ipfsHash, metadataHash)` - Register new IP assets
- `getIPAsset(ipId)` - Get IP asset details
- `getCreatorAssets(creator)` - Get all assets by creator

**Events**:
- `IPRegistered(uint256 indexed ipId, address indexed creator, string ipfsHash, string metadataHash, uint256 timestamp)`

### LicensingModule
```
0x06DE4339D2f22A25adc5b4010910E5c6423CEc44
```

**Functions**:
- `createLicense(ipId, termsHash, price, commercialRights, distributionRights, exclusivity, expiresAt)` - Create a license
- `purchaseLicense(licenseId, certificateHash)` - Purchase a license (payable)
- `getLicense(licenseId)` - Get license details

**Events**:
- `LicenseCreated(uint256 indexed licenseId, uint256 indexed ipId, address indexed creator, ...)`
- `LicensePurchased(uint256 indexed licenseId, address indexed buyer, string certificateHash, uint256 timestamp)`

## Backend Configuration

Update `backend/.env` with:

```env
# Story Protocol / Mantle Sepolia
STORY_RPC_URL=https://rpc.sepolia.mantle.xyz
STORY_CHAIN_ID=5003
STORY_IP_ASSET_REGISTRY_ADDRESS=0xAA2202d596C71e179310Df44e13324Ae716c575a
STORY_LICENSING_MODULE_ADDRESS=0x06DE4339D2f22A25adc5b4010910E5c6423CEc44
STORY_PRIVATE_KEY=<your-deployment-private-key>
```

## Verification

View contracts on Mantle Sepolia Explorer:
- IPAssetRegistry: https://explorer.sepolia.mantle.xyz/address/0xAA2202d596C71e179310Df44e13324Ae716c575a
- LicensingModule: https://explorer.sepolia.mantle.xyz/address/0x06DE4339D2f22A25adc5b4010910E5c6423CEc44

## Next Steps

1. ✅ Contracts deployed
2. ⏳ Update backend `.env` with contract addresses
3. ⏳ Restart backend server
4. ⏳ Test IP registration via API: `POST /ip/register`
5. ⏳ Test license creation: `POST /license/create`
6. ⏳ Test license purchase: `POST /license/purchase`
7. ⏳ Verify events are syncing to database

## Testing

### Test IP Registration

```bash
curl -X POST http://localhost:3001/ip/register \
  -H "Authorization: Bearer <token>" \
  -F "title=Test IP" \
  -F "file=@test-file.txt"
```

### Test License Creation

```bash
curl -X POST http://localhost:3001/license/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ipId": "<ip-asset-id>",
    "terms": {
      "commercialRights": true,
      "distributionRights": true,
      "exclusivity": false,
      "price": "1000000000000000000",
      "duration": 365
    }
  }'
```

### Test License Purchase

```bash
curl -X POST http://localhost:3001/license/purchase \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "licenseId": "<license-id>"
  }'
```

## Deployment File

Deployment details saved to:
`contracts/deployments/mantleSepolia-5003.json`

## Important Notes

- Contracts are deployed to **Mantle Sepolia testnet** (not mainnet)
- Ensure backend has sufficient testnet ETH for gas fees
- Contract owner is the deployer address
- All events are being synced to the database automatically

