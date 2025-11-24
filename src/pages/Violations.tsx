import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Search, FileText } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

export default function Violations() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Violation Reports</h1>
          <p className="text-muted-foreground">Monitor and manage unauthorized IP usage</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Violations</p>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <Search className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">1</p>
            <p className="text-xs text-muted-foreground mt-1">Enforcement successful</p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Under Investigation</p>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">1</p>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </Card>
        </div>

        <Card className="glass-card p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">AI violation monitoring coming soon</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sentrix will automatically scan the web for unauthorized uses of your IP and surface takedown-ready reports
            here. Connect your wallet on Mantle Sepolia so we can link upcoming alerts directly to your registered assets.
          </p>
          {!isConnected && (
            <Button className="bg-gradient-primary hover:opacity-90 glow-purple inline-flex items-center gap-2" asChild>
              <a href="/#cta">
                <FileText className="h-4 w-4" />
                Connect wallet to enable alerts
              </a>
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
