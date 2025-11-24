# Sentrix Smart Contracts

This folder contains the Solidity contracts that power the on-chain portions of Sentrix.

## Contracts

### `SentrixRegistry.sol`
Registers Story Protocol compatible IP assets and stores metadata references.

- `registerAsset(string title, string category, string metadataURI)` – mints a new asset owned by the caller and emits `AssetRegistered`.
- `updateMetadata(uint256 assetId, string metadataURI)` – lets the asset owner rotate its off-chain metadata pointer.
- `getAsset(uint256 assetId)` / `getAssetsByOwner(address owner)` – read helpers used by the frontend.

### `SentrixLicensing.sol`
Implements a lightweight programmable license marketplace linked to the registry.

- `createLicense(uint256 assetId, uint64 startDate, uint64 endDate, uint256 fee, string termsURI, address licensee)` – creates a pending listing controlled by the asset owner.
- `acceptLicense(uint256 licenseId)` – any wallet can accept an open license (or the designated licensee if specified) by paying the flat fee which is forwarded to the licensor.
- `revokeLicense(uint256 licenseId)` – the asset owner can mark a listing as revoked.
- `getLicensesByAsset`, `getOpenLicenses` – read helpers for dashboards and marketplace views.

## Deployment

Any EVM toolchain (Hardhat, Foundry, Remix) can deploy these contracts. A minimal Foundry workflow:

```bash
forge install
forge build

# deploy registry
forge create --rpc-url $RPC_URL --private-key $DEPLOYER_PK contracts/SentrixRegistry.sol:SentrixRegistry

# deploy licensing with the registry address
forge create --rpc-url $RPC_URL --private-key $DEPLOYER_PK contracts/SentrixLicensing.sol:SentrixLicensing \
  --constructor-args 0xRegistryAddress
```

Once deployed, copy the addresses into your Vite environment:

```
VITE_SENTRIX_REGISTRY_ADDRESS=0xRegistryAddress
VITE_SENTRIX_LICENSING_ADDRESS=0xLicensingAddress
```

Restart `npm run dev` so the frontend picks up the new env vars. The React app reads these addresses via `src/lib/contracts.ts`.

