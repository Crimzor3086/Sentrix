import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('24h'),

  // Story Protocol
  STORY_RPC_URL: z.string().url(),
  STORY_CHAIN_ID: z.string().transform(Number),
  STORY_IP_ASSET_REGISTRY_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  STORY_LICENSING_MODULE_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  STORY_PRIVATE_KEY: z.string().startsWith('0x'),

  // IPFS / Pinata
  PINATA_API_KEY: z.string(),
  PINATA_SECRET_KEY: z.string(),
  PINATA_GATEWAY_URL: z.string().url().default('https://gateway.pinata.cloud/ipfs/'),

  // Event Sync
  SYNC_INTERVAL_SECONDS: z.string().transform(Number).default('30'),
  SYNC_ENABLED: z.string().transform((val) => val === 'true').default('true'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export default env;

