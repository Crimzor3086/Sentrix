export const sentrixRegistryAbi = [
  "function registerAsset(string title, string category, string metadataURI) returns (uint256)",
  "function updateMetadata(uint256 assetId, string metadataURI)",
  "function getAsset(uint256 assetId) view returns (tuple(uint256 id, address owner, string title, string category, string metadataURI, uint64 createdAt))",
  "function getAssetsByOwner(address owner) view returns (tuple(uint256 id, address owner, string title, string category, string metadataURI, uint64 createdAt)[])",
  "function assetOwner(uint256 assetId) view returns (address)",
  "event AssetRegistered(uint256 indexed assetId, address indexed owner, string title, string category, string metadataURI)",
] as const;

