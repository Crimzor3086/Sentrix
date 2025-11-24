import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { getAuthNonce, verifySignature, storeAuthToken, removeAuthToken, getAuthToken } from '@/lib/wallet';
import { toast } from 'sonner';

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  connect: () => void;
  disconnect: () => void;
  authenticate: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token && isConnected && address) {
      setIsAuthenticated(true);
    }
  }, [isConnected, address]);

  const handleConnect = () => {
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  const handleDisconnect = () => {
    wagmiDisconnect();
    removeAuthToken();
    setIsAuthenticated(false);
    toast.success('Wallet disconnected');
  };

  const handleAuthenticate = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Get nonce from backend
      const { message } = await getAuthNonce(address);

      // Sign message with wallet
      const signature = await signMessageAsync({ message });

      // Verify signature and get token
      const { token, user } = await verifySignature(address, signature);

      // Store token
      storeAuthToken(token);
      setIsAuthenticated(true);

      toast.success(`Authenticated as ${address.slice(0, 6)}...${address.slice(-4)}`);
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !isLoading) {
      handleAuthenticate();
    }
  }, [isConnected, address]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        isAuthenticated,
        isLoading,
        connect: handleConnect,
        disconnect: handleDisconnect,
        authenticate: handleAuthenticate,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

