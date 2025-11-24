import { createWalletClient, createPublicClient, http, type Address, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import env from '../config/env.js';

// Contract ABIs (simplified - in production, import from generated ABIs)
const IP_ASSET_REGISTRY_ABI = parseAbi([
  'function registerIPAsset(string memory ipfsHash, string memory metadataHash) external returns (uint256)',
  'function getIPAsset(uint256 ipId) external view returns (tuple(uint256 id, address creator, string ipfsHash, string metadataHash, uint256 createdAt, bool exists))',
  'function getCreatorAssets(address creator) external view returns (uint256[] memory)',
  'event IPRegistered(uint256 indexed ipId, address indexed creator, string ipfsHash, string metadataHash, uint256 timestamp)',
]);

const LICENSING_MODULE_ABI = parseAbi([
  'function createLicense(uint256 ipId, string memory termsHash, uint256 price, bool commercialRights, bool distributionRights, bool exclusivity, uint256 expiresAt) external returns (uint256)',
  'function purchaseLicense(uint256 licenseId, string memory certificateHash) external payable',
  'function getLicense(uint256 licenseId) external view returns (tuple(uint256 id, uint256 ipId, address creator, address buyer, string termsHash, string certificateHash, uint256 price, uint256 expiresAt, bool commercialRights, bool distributionRights, bool exclusivity, uint256 createdAt, bool active, bool exists))',
  'function getIPLicenses(uint256 ipId) external view returns (uint256[] memory)',
  'event LicenseCreated(uint256 indexed licenseId, uint256 indexed ipId, address indexed creator, string termsHash, uint256 price, bool commercialRights, bool distributionRights, bool exclusivity, uint256 expiresAt)',
  'event LicensePurchased(uint256 indexed licenseId, address indexed buyer, string certificateHash, uint256 timestamp)',
]);

let walletClient: ReturnType<typeof createWalletClient> | null = null;
let publicClient: ReturnType<typeof createPublicClient> | null = null;

const chain = {
  id: env.STORY_CHAIN_ID,
  rpcUrls: {
    default: { http: [env.STORY_RPC_URL] },
  },
};

/**
 * Initialize Story Protocol wallet client
 */
export function initStoryClient() {
  if (walletClient) return walletClient;

  const account = privateKeyToAccount(env.STORY_PRIVATE_KEY as `0x${string}`);
  
  walletClient = createWalletClient({
    account,
    chain,
    transport: http(env.STORY_RPC_URL),
  });

  return walletClient;
}

/**
 * Initialize public client for reading
 */
export function initPublicClient() {
  if (publicClient) return publicClient;

  publicClient = createPublicClient({
    chain,
    transport: http(env.STORY_RPC_URL),
  });

  return publicClient;
}

/**
 * Register IP Asset on-chain
 */
export async function registerIPAsset(
  ipfsHash: string,
  metadataHash: string,
  creatorAddress: Address
): Promise<{ ipId: string; txHash: string }> {
  const client = initStoryClient();
  const publicClient = initPublicClient();

  if (!env.STORY_IP_ASSET_REGISTRY_ADDRESS) {
    throw new Error('STORY_IP_ASSET_REGISTRY_ADDRESS not configured');
  }

  const hash = await client.writeContract({
    address: env.STORY_IP_ASSET_REGISTRY_ADDRESS as Address,
    abi: IP_ASSET_REGISTRY_ABI,
    functionName: 'registerIPAsset',
    args: [ipfsHash, metadataHash],
    account: client.account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  // Extract IP ID from event
  const ipRegisteredEvent = receipt.logs.find((log) => {
    try {
      return publicClient.decodeEventLog({
        abi: IP_ASSET_REGISTRY_ABI,
        data: log.data,
        topics: log.topics,
      }).eventName === 'IPRegistered';
    } catch {
      return false;
    }
  });

  if (!ipRegisteredEvent) {
    throw new Error('IPRegistered event not found in transaction');
  }

  const decoded = publicClient.decodeEventLog({
    abi: IP_ASSET_REGISTRY_ABI,
    data: ipRegisteredEvent.data,
    topics: ipRegisteredEvent.topics,
  });

  const ipId = (decoded.args as any).ipId.toString();

  return {
    ipId,
    txHash: hash,
  };
}

/**
 * Create a license on-chain
 */
export async function createLicense(
  ipId: string,
  terms: Record<string, any>,
  creatorAddress: Address,
  termsHash: string // IPFS hash of terms (should be uploaded before calling this)
): Promise<{ licenseId: string; txHash: string }> {
  const client = initStoryClient();
  const publicClient = initPublicClient();

  if (!env.STORY_LICENSING_MODULE_ADDRESS) {
    throw new Error('STORY_LICENSING_MODULE_ADDRESS not configured');
  }

  if (!termsHash) {
    throw new Error('Terms hash (IPFS) is required');
  }

  const price = BigInt(terms.price || '0');
  const expiresAt = terms.duration 
    ? BigInt(Math.floor(Date.now() / 1000) + terms.duration * 24 * 60 * 60)
    : BigInt(0);

  const hash = await client.writeContract({
    address: env.STORY_LICENSING_MODULE_ADDRESS as Address,
    abi: LICENSING_MODULE_ABI,
    functionName: 'createLicense',
    args: [
      BigInt(ipId),
      termsHash,
      price,
      terms.commercialRights || false,
      terms.distributionRights || false,
      terms.exclusivity || false,
      expiresAt,
    ],
    account: client.account,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  // Extract license ID from event
  const licenseCreatedEvent = receipt.logs.find((log) => {
    try {
      return publicClient.decodeEventLog({
        abi: LICENSING_MODULE_ABI,
        data: log.data,
        topics: log.topics,
      }).eventName === 'LicenseCreated';
    } catch {
      return false;
    }
  });

  if (!licenseCreatedEvent) {
    throw new Error('LicenseCreated event not found in transaction');
  }

  const decoded = publicClient.decodeEventLog({
    abi: LICENSING_MODULE_ABI,
    data: licenseCreatedEvent.data,
    topics: licenseCreatedEvent.topics,
  });

  const licenseId = (decoded.args as any).licenseId.toString();

  return {
    licenseId,
    txHash: hash,
  };
}

/**
 * Purchase a license on-chain
 */
export async function purchaseLicense(
  licenseId: string,
  buyerAddress: Address,
  certificateHash: string
): Promise<{ txHash: string }> {
  const client = initStoryClient();
  const publicClient = initPublicClient();

  if (!env.STORY_LICENSING_MODULE_ADDRESS) {
    throw new Error('STORY_LICENSING_MODULE_ADDRESS not configured');
  }

  // Get license price first
  const license = await publicClient.readContract({
    address: env.STORY_LICENSING_MODULE_ADDRESS as Address,
    abi: LICENSING_MODULE_ABI,
    functionName: 'getLicense',
    args: [BigInt(licenseId)],
  });

  const price = (license as any).price;

  const hash = await client.writeContract({
    address: env.STORY_LICENSING_MODULE_ADDRESS as Address,
    abi: LICENSING_MODULE_ABI,
    functionName: 'purchaseLicense',
    args: [BigInt(licenseId), certificateHash],
    account: client.account,
    value: price,
  });

  await publicClient.waitForTransactionReceipt({ hash });

  return {
    txHash: hash,
  };
}

/**
 * Get IP Asset details from chain
 */
export async function getIPAssetDetails(ipId: string): Promise<any> {
  const publicClient = initPublicClient();

  if (!env.STORY_IP_ASSET_REGISTRY_ADDRESS) {
    throw new Error('STORY_IP_ASSET_REGISTRY_ADDRESS not configured');
  }

  const ipAsset = await publicClient.readContract({
    address: env.STORY_IP_ASSET_REGISTRY_ADDRESS as Address,
    abi: IP_ASSET_REGISTRY_ABI,
    functionName: 'getIPAsset',
    args: [BigInt(ipId)],
  });

  return ipAsset;
}

