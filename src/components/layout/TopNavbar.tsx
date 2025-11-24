import { Bell, Search, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { WalletButton } from "@/components/wallet/WalletButton";

export function TopNavbar() {
  return (
    <header className="h-16 border-b border-border flex items-center px-6 gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <SidebarTrigger />
      
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <ScanLine className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Scan</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
        </Button>

        <WalletButton />
      </div>
    </header>
  );
}
