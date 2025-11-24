import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WalletConnectModal = ({ open, onOpenChange }: WalletConnectModalProps) => {
  const { connect } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      await connect();
      toast.success("Wallet connected successfully!");
      onOpenChange(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to connect wallet");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-glass-border">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Connect your wallet to access Sentrix and manage your IP assets
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <Button 
            onClick={handleConnect}
            className="w-full h-14 bg-gradient-primary hover:opacity-90 transition-smooth glow-purple"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Connect Wallet
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            By connecting, you agree to Sentrix Terms of Service
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
