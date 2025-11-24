export const sentrixLicensingAbi = [
  "function createLicense(uint256 assetId, uint64 startDate, uint64 endDate, uint256 fee, string termsURI, address licensee) returns (uint256)",
  "function acceptLicense(uint256 licenseId) payable",
  "function revokeLicense(uint256 licenseId)",
  "function getLicense(uint256 licenseId) view returns (tuple(uint256 id, uint256 assetId, address licensor, address licensee, uint256 fee, uint64 startDate, uint64 endDate, string termsURI, uint8 status))",
  "function getLicensesByAsset(uint256 assetId) view returns (tuple(uint256 id, uint256 assetId, address licensor, address licensee, uint256 fee, uint64 startDate, uint64 endDate, string termsURI, uint8 status)[])",
  "function getOpenLicenses() view returns (tuple(uint256 id, uint256 assetId, address licensor, address licensee, uint256 fee, uint64 startDate, uint64 endDate, string termsURI, uint8 status)[])",
  "event LicenseCreated(uint256 indexed licenseId, uint256 indexed assetId, address indexed licensor, uint256 fee, string termsURI)",
  "event LicenseAccepted(uint256 indexed licenseId, address indexed licensee)",
  "event LicenseRevoked(uint256 indexed licenseId)",
] as const;

