import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Music, Image as ImageIcon, Video, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function IPAssets() {
  const assets = [
    { 
      id: 1, 
      title: "Digital Art Collection #42",
      tokenId: "0x7a2f...b3c1",
      category: "art",
      status: "active",
      thumbnail: "🎨"
    },
    { 
      id: 2, 
      title: "Summer Vibes Music Track",
      tokenId: "0x9d4e...a2f8",
      category: "music",
      status: "active",
      thumbnail: "🎵"
    },
    { 
      id: 3, 
      title: "Brand Logo Design v2",
      tokenId: "0x3c7a...d9e1",
      category: "design",
      status: "active",
      thumbnail: "🎯"
    },
    { 
      id: 4, 
      title: "Photo Series - Urban Life",
      tokenId: "0x8b2f...c4a7",
      category: "photography",
      status: "licensed",
      thumbnail: "📸"
    },
    { 
      id: 5, 
      title: "Documentary Video",
      tokenId: "0x5e9a...f1b3",
      category: "video",
      status: "active",
      thumbnail: "🎬"
    },
    { 
      id: 6, 
      title: "Written Article Series",
      tokenId: "0x2a8c...e6d4",
      category: "writing",
      status: "active",
      thumbnail: "✍️"
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "art": return <ImageIcon className="h-4 w-4" />;
      case "music": return <Music className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
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
              <div className="aspect-video bg-gradient-primary/10 flex items-center justify-center text-6xl border-b border-border">
                {asset.thumbnail}
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-smooth">
                    {asset.title}
                  </h3>
                  <Badge variant={asset.status === "active" ? "default" : "secondary"} className="shrink-0">
                    {asset.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getCategoryIcon(asset.category)}
                  <span className="capitalize">{asset.category}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Token ID:</span>
                  <code className="px-2 py-1 bg-muted/50 rounded text-xs font-mono">{asset.tokenId}</code>
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
      </div>
    </div>
  );
}
