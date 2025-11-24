import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Music, Image as ImageIcon, Video, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useRegistryAssets } from "@/hooks/useRegistryAssets";
import { useWallet } from "@/contexts/WalletContext";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "art":
    case "digital art":
      return <ImageIcon className="h-4 w-4" />;
    case "music":
      return <Music className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export default function IPAssets() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <IPAssetsContent />
      </div>
    </div>
  );
}

const IPAssetsContent = () => {
  const { isConnected } = useWallet();
  const { data, isLoading, isError, refetch } = useRegistryAssets();

  if (!isConnected) {
    return (
      <Card className="glass-card p-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Connect your wallet</h2>
        <p className="text-muted-foreground">
          We’ll load your Story Protocol assets as soon as MetaMask is connected.
        </p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="glass-card p-6 space-y-4 animate-pulse">
            <div className="aspect-video bg-muted/30 rounded-lg" />
            <div className="h-6 bg-muted/30 rounded-md" />
            <div className="h-4 bg-muted/20 rounded-md" />
            <div className="h-10 bg-muted/20 rounded-md" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="glass-card p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">Unable to load assets</h2>
        <p className="text-muted-foreground">
          Make sure your wallet is connected to Mantle Sepolia and that the Sentrix contract addresses are configured.
        </p>
        <Button onClick={() => refetch()} className="bg-gradient-primary hover:opacity-90">
          Retry
        </Button>
      </Card>
    );
  }

  const assets = data ?? [];

  if (assets.length === 0) {
    return (
      <Card className="glass-card p-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">No assets registered yet</h2>
        <p className="text-muted-foreground">
          Mint your first IP token to see it appear in this dashboard.
        </p>
        <Link to="/ip/register">
          <Button className="bg-gradient-primary hover:opacity-90 glow-purple">
            <Plus className="mr-2 h-4 w-4" />
            Register IP Asset
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">My IP Assets</h1>
          <p className="text-muted-foreground">Manage your registered intellectual property</p>
        </div>
        <Link to="/ip/register">
          <Button className="bg-gradient-primary hover:opacity-90 glow-purple">
            <Plus className="mr-2 h-4 w-4" />
            Register New IP
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <Card key={asset.id} className="glass-card overflow-hidden hover:glow-purple transition-smooth group">
            <div className="aspect-video bg-gradient-primary/10 flex items-center justify-center text-4xl border-b border-border">
              {asset.category.slice(0, 1).toUpperCase()}
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-smooth">
                  {asset.title}
                </h3>
                <Badge variant="default" className="shrink-0 capitalize">
                  {asset.category}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{asset.description || "Metadata stored on-chain"}</p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getCategoryIcon(asset.category)}
                <span className="capitalize">{asset.category}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Asset ID:</span>
                <code className="px-2 py-1 bg-muted/50 rounded text-xs font-mono">#{asset.id}</code>
              </div>

              <Link to={`/ip/${asset.id}`}>
                <Button className="w-full glass hover:bg-primary/20" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
