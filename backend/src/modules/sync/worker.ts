import cron from 'node-cron';
import env from '../../config/env.js';
import { syncStoryEvents, processStoredEvents } from './service.js';

/**
 * Start the Story event sync worker
 */
export async function startSyncWorker() {
  if (!env.SYNC_ENABLED) {
    console.log('⚠️  Story event sync is disabled');
    return;
  }

  console.log('🔄 Starting Story event sync worker...');

  // Sync events every N seconds
  const intervalSeconds = env.SYNC_INTERVAL_SECONDS;
  const cronExpression = `*/${intervalSeconds} * * * * *`; // Every N seconds

  cron.schedule(cronExpression, async () => {
    try {
      console.log('🔄 Syncing Story events...');
      const result = await syncStoryEvents();
      console.log(`✅ Synced ${result.synced} events`);

      // Process stored events
      const processed = await processStoredEvents();
      if (processed.processed > 0) {
        console.log(`✅ Processed ${processed.processed} stored events`);
      }
    } catch (error) {
      console.error('❌ Error syncing events:', error);
    }
  });

  console.log(`✅ Sync worker started (interval: ${intervalSeconds}s)`);
}

// Run if called directly (for standalone execution)
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(process.cwd(), ''))) {
  startSyncWorker().catch(console.error);
}

