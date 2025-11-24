import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Wallet, LogOut } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const { isConnected, address, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="glass-card border-b border-glass-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Shield className="h-8 w-8 text-primary group-hover:glow-purple transition-smooth" />
            <span className="text-2xl font-bold gradient-text">Sentrix</span>
          </Link>

          {isConnected && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm hover:text-primary transition-smooth">
                Dashboard
              </Link>
              <Link to="/ip/assets" className="text-sm hover:text-primary transition-smooth">
                My IP Assets
              </Link>
              <Link to="/licenses" className="text-sm hover:text-primary transition-smooth">
                Marketplace
              </Link>
              <Link to="/violations" className="text-sm hover:text-primary transition-smooth">
                Violations
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4">
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 glass hover:glow-purple">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {address?.substring(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm">{address && formatAddress(address)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-glass-border">
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem onClick={disconnect} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button className="bg-gradient-primary hover:opacity-90 glow-purple">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
