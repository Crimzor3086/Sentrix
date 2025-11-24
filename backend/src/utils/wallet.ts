import { verifyMessage } from 'viem';
import type { Address } from 'viem';

/**
 * Verify a wallet signature
 */
export async function verifyWalletSignature(
  message: string,
  signature: string,
  address: Address
): Promise<boolean> {
  try {
    const isValid = await verifyMessage({
      address,
      message,
      signature: signature as `0x${string}`,
    });
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Generate a nonce for wallet authentication
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

/**
 * Create authentication message
 */
export function createAuthMessage(nonce: string): string {
  return `Sign in to Sentrix: ${nonce}`;
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Normalize address to checksum format
 */
export function toChecksumAddress(address: string): Address {
  // Simple checksum - in production, use a library like ethers.js checksumAddress
  return address.toLowerCase() as Address;
}

