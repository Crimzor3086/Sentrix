import { prisma } from '../../config/database.js';
import { createPublicClient, http, type Address, parseAbi, decodeEventLog, defineChain } from 'viem';
import env from '../../config/env.js';

// Contract ABIs for event decoding
const IP_ASSET_REGISTRY_ABI = parseAbi([
  'event IPRegistered(uint256 indexed ipId, address indexed creator, string ipfsHash, string metadataHash, uint256 timestamp)',
]);

const LICENSING_MODULE_ABI = parseAbi([
  'event LicenseCreated(uint256 indexed licenseId, uint256 indexed ipId, address indexed creator, string termsHash, uint256 price, bool commercialRights, bool distributionRights, bool exclusivity, uint256 expiresAt)',
  'event LicensePurchased(uint256 indexed licenseId, address indexed buyer, string certificateHash, uint256 timestamp)',
]);

const IP_REGISTERED_EVENT = 'IPRegistered';
const LICENSE_CREATED_EVENT = 'LicenseCreated';
const LICENSE_PURCHASED_EVENT = 'LicensePurchased';

let publicClient: ReturnType<typeof createPublicClient> | null = null;

const storyChain = defineChain({
  id: env.STORY_CHAIN_ID,
  name: 'Mantle Sepolia',
  network: 'mantle-sepolia',
  nativeCurrency: {
    name: 'Mantle Testnet ETH',
    symbol: 'MNT',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [env.STORY_RPC_URL] },
    public: { http: [env.STORY_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Explorer',
      url: 'https://explorer.sepolia.mantle.xyz',
    },
  },
  testnet: true,
});

/**
 * Initialize public client for Story Protocol
 */
function initPublicClient() {
  if (publicClient) return publicClient;

  publicClient = createPublicClient({
    chain: storyChain,
    transport: http(env.STORY_RPC_URL),
  });

  return publicClient;
}

/**
 * Sync Story Protocol events to database
 */
export async function syncStoryEvents(fromBlock?: bigint, toBlock?: bigint) {
  const client = initPublicClient();
  
  // Get latest processed block
  const lastEvent = await prisma.storyEvent.findFirst({
    orderBy: { blockNumber: 'desc' },
  });

  const startBlock = fromBlock || (lastEvent ? lastEvent.blockNumber + 1n : 0n);
  const endBlock = toBlock || await client.getBlockNumber();

  if (startBlock > endBlock) {
    return { synced: 0, message: 'No new blocks to sync' };
  }

  // Get event logs from deployed contracts
  const events: any[] = [];
  
  try {
    if (!env.STORY_IP_ASSET_REGISTRY_ADDRESS || !env.STORY_LICENSING_MODULE_ADDRESS) {
      throw new Error('Contract addresses not configured');
    }

    // Get IP Registered events
    const ipRegisteredLogs = await client.getLogs({
      address: env.STORY_IP_ASSET_REGISTRY_ADDRESS as Address,
      event: IP_ASSET_REGISTRY_ABI[0],
      fromBlock: startBlock,
      toBlock: endBlock,
    });
    
    // Get License Created events
    const licenseCreatedLogs = await client.getLogs({
      address: env.STORY_LICENSING_MODULE_ADDRESS as Address,
      event: LICENSING_MODULE_ABI[0],
      fromBlock: startBlock,
      toBlock: endBlock,
    });

    // Get License Purchased events
    const licensePurchasedLogs = await client.getLogs({
      address: env.STORY_LICENSING_MODULE_ADDRESS as Address,
      event: LICENSING_MODULE_ABI[1],
      fromBlock: startBlock,
      toBlock: endBlock,
    });
    
    // Parse and transform logs into events array
    for (const log of ipRegisteredLogs) {
      const decoded = decodeEventLog({
        abi: IP_ASSET_REGISTRY_ABI,
        data: log.data,
        topics: log.topics,
      });
      events.push({
        type: IP_REGISTERED_EVENT,
        blockNumber: Number(log.blockNumber),
        transactionHash: log.transactionHash,
        ipId: (decoded.args as any).ipId.toString(),
        walletAddress: (decoded.args as any).creator,
        data: decoded.args,
      });
    }

    for (const log of licenseCreatedLogs) {
      const decoded = decodeEventLog({
        abi: LICENSING_MODULE_ABI,
        data: log.data,
        topics: log.topics,
      });
      events.push({
        type: LICENSE_CREATED_EVENT,
        blockNumber: Number(log.blockNumber),
        transactionHash: log.transactionHash,
        licenseId: (decoded.args as any).licenseId.toString(),
        ipId: (decoded.args as any).ipId.toString(),
        walletAddress: (decoded.args as any).creator,
        data: decoded.args,
      });
    }

    for (const log of licensePurchasedLogs) {
      const decoded = decodeEventLog({
        abi: LICENSING_MODULE_ABI,
        data: log.data,
        topics: log.topics,
      });
      events.push({
        type: LICENSE_PURCHASED_EVENT,
        blockNumber: Number(log.blockNumber),
        transactionHash: log.transactionHash,
        licenseId: (decoded.args as any).licenseId.toString(),
        walletAddress: (decoded.args as any).buyer,
        data: decoded.args,
      });
    }
  } catch (error) {
    console.error('Error fetching contract events:', error);
    throw new Error('Failed to fetch contract events. Ensure contract addresses are configured and contracts are deployed.');
  }

  // Process and store events
  let synced = 0;
  for (const event of events) {
    try {
      await prisma.storyEvent.create({
        data: {
          eventType: event.type,
          blockNumber: BigInt(event.blockNumber),
          transactionHash: event.transactionHash,
          ipId: event.ipId,
          licenseId: event.licenseId,
          walletAddress: event.walletAddress,
          data: event.data || {},
          processed: false,
        },
      });
      synced++;
    } catch (error: any) {
      // Skip duplicate events
      if (!error.message.includes('Unique constraint')) {
        console.error('Error syncing event:', error);
      }
    }
  }

  return { synced, fromBlock: startBlock, toBlock: endBlock };
}

/**
 * Process stored events and update database
 */
export async function processStoredEvents() {
  const unprocessedEvents = await prisma.storyEvent.findMany({
    where: { processed: false },
    orderBy: { blockNumber: 'asc' },
    take: 100,
  });

  for (const event of unprocessedEvents) {
    try {
      switch (event.eventType) {
        case IP_REGISTERED_EVENT:
          // Update IP Asset with Story data
          if (event.ipId && event.walletAddress) {
            await prisma.iPAsset.updateMany({
              where: {
                creatorWallet: event.walletAddress.toLowerCase(),
                storyIpId: null,
              },
              data: {
                storyIpId: event.ipId,
                storyTxHash: event.transactionHash,
              },
            });
          }
          break;

        case LICENSE_CREATED_EVENT:
          // Update License with Story data
          if (event.licenseId && event.ipId) {
            await prisma.license.updateMany({
              where: {
                ipId: event.ipId,
                storyLicenseId: null,
              },
              data: {
                storyLicenseId: event.licenseId,
                storyTxHash: event.transactionHash,
              },
            });
          }
          break;

        case LICENSE_PURCHASED_EVENT:
          // Update License purchase
          if (event.licenseId && event.walletAddress) {
            await prisma.license.updateMany({
              where: {
                storyLicenseId: event.licenseId,
              },
              data: {
                buyerWallet: event.walletAddress.toLowerCase(),
                status: 'active',
                storyTxHash: event.transactionHash,
              },
            });
          }
          break;
      }

      // Mark as processed
      await prisma.storyEvent.update({
        where: { id: event.id },
        data: { processed: true },
      });
    } catch (error) {
      console.error(`Error processing event ${event.id}:`, error);
    }
  }

  return { processed: unprocessedEvents.length };
}

