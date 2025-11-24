import { describe, it, expect, beforeEach } from 'vitest';
import { generateAuthNonce, verifyWalletAuth } from '../service.js';
import { createAuthMessage } from '../../../utils/wallet.js';

describe('Auth Service', () => {
  describe('generateAuthNonce', () => {
    it('should generate a nonce for valid wallet address', async () => {
      const wallet = '0x1234567890123456789012345678901234567890';
      const nonce = await generateAuthNonce(wallet);
      
      expect(nonce).toBeDefined();
      expect(typeof nonce).toBe('string');
      expect(nonce.length).toBeGreaterThan(0);
    });

    it('should throw error for invalid wallet address', async () => {
      const invalidWallet = 'invalid-address';
      
      await expect(generateAuthNonce(invalidWallet)).rejects.toThrow();
    });
  });

  describe('createAuthMessage', () => {
    it('should create correct auth message format', () => {
      const nonce = 'test-nonce-123';
      const message = createAuthMessage(nonce);
      
      expect(message).toBe(`Sign in to Sentrix: ${nonce}`);
    });
  });
});

