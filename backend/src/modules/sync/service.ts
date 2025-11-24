import { prisma } from '../../config/database.js';
import { createPublicClient, http, type Address } from 'viem';
import env from '../../config/env.js';

// Story Protocol event signatures (example - adjust based on actual contracts)
const IP_REGISTERED_EVENT = 'IPRegistered';
const LICENSE_CREATED_EVENT = 'LicenseCreated';
const LICENSE_PURCHASED_EVENT = 'LicensePurchased';

let publicClient: ReturnType<typeof createPublicClient> | null = null;

/**
 * Initialize public client for Story Protocol
 */
function initPublicClient() {
  if (publicClient) return publicClient;

  publicClient = createPublicClient({
    chain: {
      id: env.STORY_CHAIN_ID,
      rpcUrls: {
        default: { http: [env.STORY_RPC_URL] },
      },
    },
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

  // TODO: Replace with actual Story Protocol contract event logs
  // This is a placeholder structure
  // In production, you would:
  // 1. Get event logs from Story Protocol contracts
  // 2. Parse events (IPRegistered, LicenseCreated, LicensePurchased)
  // 3. Store in database

  // Example structure:
  // const logs = await client.getLogs({
  //   address: env.STORY_IP_ASSET_REGISTRY_ADDRESS as Address,
  //   event: ipRegisteredEventAbi,
  //   fromBlock: startBlock,
  //   toBlock: endBlock,
  // });

  // For now, we'll create a mock sync that demonstrates the structure
  const events: any[] = [];

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

