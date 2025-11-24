import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Scale, AlertTriangle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletContext";

export default function Dashboard() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your IP portfolio overview</p>
          </div>
          <Link to="/ip/register">
            <Button className="bg-gradient-primary hover:opacity-90 glow-purple">
              <Plus className="mr-2 h-4 w-4" />
              Register New IP
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <Card className="glass-card p-8 border border-dashed border-border/60 text-center">
            <p className="text-lg font-medium mb-2">Analytics coming soon</p>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isConnected
                ? "Your wallet is connected. As soon as IP assets sync from Story Protocol, you’ll see live metrics here."
                : "Connect your wallet to enable on-chain analytics for your IP portfolio."}
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/ip/register" className="group">
            <Card className="glass-card p-6 hover:glow-purple transition-smooth cursor-pointer h-full">
              <FileText className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Register IP</h3>
              <p className="text-sm text-muted-foreground">Mint new IP assets on-chain</p>
            </Card>
          </Link>

          <Link to="/licenses" className="group">
            <Card className="glass-card p-6 hover:glow-cyan transition-smooth cursor-pointer h-full">
              <Scale className="h-8 w-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Browse Licenses</h3>
              <p className="text-sm text-muted-foreground">Discover IP in marketplace</p>
            </Card>
          </Link>

          <Link to="/violations" className="group">
            <Card className="glass-card p-6 hover:glow-purple transition-smooth cursor-pointer h-full">
              <AlertTriangle className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Check Violations</h3>
              <p className="text-sm text-muted-foreground">Monitor IP protection status</p>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
          </div>
          <div className="p-6 text-center text-muted-foreground">
            Activity feeds will populate automatically once Sentrix indexes on-chain events for your registered assets.
            <div className="mt-4">
              <Badge variant="secondary" className="uppercase tracking-wide">
                No events yet
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
