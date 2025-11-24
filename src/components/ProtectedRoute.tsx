import { ReactNode, useEffect, useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { WalletConnectModal } from "./WalletConnectModal";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isConnected } = useWallet();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setShowModal(true);
    }
  }, [isConnected]);

  if (!isConnected) {
    return <WalletConnectModal open={showModal} onOpenChange={setShowModal} />;
  }

  return <>{children}</>;
};
