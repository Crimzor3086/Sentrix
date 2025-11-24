import env from './config/env.js';
import { createApp } from './app.js';
import { startSyncWorker } from './modules/sync/worker.js';

/**
 * Start the server
 */
async function start() {
  try {
    const app = await createApp();

    // Start Story event sync worker
    if (env.SYNC_ENABLED) {
      await startSyncWorker();
    }

    // Start server
    await app.listen({
      port: Number(env.PORT),
      host: '0.0.0.0',
    });

    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    console.log(`📚 API docs available at http://localhost:${env.PORT}/docs`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

start();

