import { prisma } from '../../config/database.js';
import { generateNonce, createAuthMessage, verifyWalletSignature, isValidAddress } from '../../utils/wallet.js';
import type { Address } from 'viem';

// Store nonces in memory (in production, use Redis)
const nonceStore = new Map<string, { nonce: string; expiresAt: number }>();

const NONCE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generate and store a nonce for wallet authentication
 */
export async function generateAuthNonce(walletAddress: string): Promise<string> {
  if (!isValidAddress(walletAddress)) {
    throw new Error('Invalid wallet address format');
  }

  const normalizedAddress = walletAddress.toLowerCase();
  const nonce = generateNonce();

  nonceStore.set(normalizedAddress, {
    nonce,
    expiresAt: Date.now() + NONCE_EXPIRY_MS,
  });

  // Clean up expired nonces
  setTimeout(() => {
    const stored = nonceStore.get(normalizedAddress);
    if (stored && stored.expiresAt < Date.now()) {
      nonceStore.delete(normalizedAddress);
    }
  }, NONCE_EXPIRY_MS);

  return nonce;
}

/**
 * Verify wallet signature and create/update user
 */
export async function verifyWalletAuth(
  walletAddress: string,
  signature: string
): Promise<{ user: any; token: string }> {
  if (!isValidAddress(walletAddress)) {
    throw new Error('Invalid wallet address format');
  }

  const normalizedAddress = walletAddress.toLowerCase();
  const stored = nonceStore.get(normalizedAddress);

  if (!stored) {
    throw new Error('Nonce not found or expired. Please request a new nonce.');
  }

  if (stored.expiresAt < Date.now()) {
    nonceStore.delete(normalizedAddress);
    throw new Error('Nonce expired. Please request a new nonce.');
  }

  const message = createAuthMessage(stored.nonce);
  const isValid = await verifyWalletSignature(
    message,
    signature,
    normalizedAddress as Address
  );

  if (!isValid) {
    throw new Error('Invalid signature');
  }

  // Remove used nonce
  nonceStore.delete(normalizedAddress);

  // Create or update user
  const user = await prisma.user.upsert({
    where: { walletAddress: normalizedAddress },
    update: {},
    create: {
      walletAddress: normalizedAddress,
    },
  });

  // Generate JWT token (will be handled by Fastify JWT plugin)
  return {
    user: {
      id: user.id,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
    },
    token: '', // Will be set by JWT plugin
  };
}

/**
 * Get user by wallet address
 */
export async function getUserByWallet(walletAddress: string) {
  const normalizedAddress = walletAddress.toLowerCase();
  return prisma.user.findUnique({
    where: { walletAddress: normalizedAddress },
  });
}

