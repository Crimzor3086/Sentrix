import { createConfig, http } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// WalletConnect Project ID - get from https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

export const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(),
    ...(WALLETCONNECT_PROJECT_ID ? [walletConnect({ projectId: WALLETCONNECT_PROJECT_ID })] : []),
    coinbaseWallet({ appName: 'Sentrix' }),
  ],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

/**
 * Get authentication nonce from backend
 */
export async function getAuthNonce(walletAddress: string): Promise<{ nonce: string; message: string }> {
  const response = await fetch(`${API_URL}/auth/nonce?wallet=${walletAddress}`);
  if (!response.ok) {
    throw new Error('Failed to get authentication nonce');
  }
  return response.json();
}

/**
 * Verify wallet signature and get JWT token
 */
export async function verifySignature(
  walletAddress: string,
  signature: string
): Promise<{ token: string; user: any }> {
  const response = await fetch(`${API_URL}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet: walletAddress, signature }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Authentication failed');
  }

  return response.json();
}

/**
 * Store auth token in localStorage
 */
export function storeAuthToken(token: string) {
  localStorage.setItem('sentrix_auth_token', token);
}

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('sentrix_auth_token');
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken() {
  localStorage.removeItem('sentrix_auth_token');
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

