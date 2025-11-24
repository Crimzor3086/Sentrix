import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function LicenseMarketplace() {
  const licenses = [
    {
      id: 1,
      assetTitle: "Digital Art Collection #42",
      licenseName: "Commercial License",
      type: "Commercial",
      territory: "Worldwide",
      duration: "1 Year",
      price: "$499",
      thumbnail: "🎨",
    },
    {
      id: 2,
      assetTitle: "Summer Vibes Music Track",
      licenseName: "Streaming License",
      type: "Commercial",
      territory: "Worldwide",
      duration: "Perpetual",
      price: "$299",
      thumbnail: "🎵",
    },
    {
      id: 3,
      assetTitle: "Brand Logo Design",
      licenseName: "Exclusive Commercial",
      type: "Exclusive",
      territory: "US Only",
      duration: "5 Years",
      price: "$2,499",
      thumbnail: "🎯",
    },
    {
      id: 4,
      assetTitle: "Photo Series - Urban Life",
      licenseName: "Editorial License",
      type: "Non-Commercial",
      territory: "Worldwide",
      duration: "2 Years",
      price: "$99",
      thumbnail: "📸",
    },
    {
      id: 5,
      assetTitle: "Documentary Video",
      licenseName: "Distribution Rights",
      type: "Commercial",
      territory: "EU",
      duration: "3 Years",
      price: "$1,299",
      thumbnail: "🎬",
    },
    {
      id: 6,
      assetTitle: "3D Model - Character",
      licenseName: "Game Dev License",
      type: "Commercial",
      territory: "Worldwide",
      duration: "Perpetual",
      price: "$799",
      thumbnail: "🎮",
    },
  ];

  const handlePurchase = (licenseName: string) => {
    toast.success(`License "${licenseName}" added to cart!`);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">License Marketplace</h1>
          <p className="text-muted-foreground">Browse and purchase IP licenses from creators</p>
        </div>

        {/* Filters */}
        <Card className="glass-card p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search licenses..." 
                  className="pl-10 glass border-border"
                />
              </div>
            </div>

            <Select>
              <SelectTrigger className="glass border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="glass-card border-glass-border">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="art">Digital Art</SelectItem>
                <SelectItem value="music">Music</SelectItem>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="glass border-border">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="glass-card border-glass-border">
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under100">Under $100</SelectItem>
                <SelectItem value="100-500">$100 - $500</SelectItem>
                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                <SelectItem value="over1000">Over $1,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Licenses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licenses.map((license) => (
            <Card key={license.id} className="glass-card overflow-hidden hover:glow-purple transition-smooth group">
              <div className="aspect-video bg-gradient-primary/10 flex items-center justify-center text-6xl border-b border-border">
                {license.thumbnail}
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{license.assetTitle}</p>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-smooth">
                    {license.licenseName}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="default" className="text-xs">
                    {license.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {license.territory}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {license.duration}
                  </Badge>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full glass text-xs justify-start">
                        <FileText className="h-3 w-3 mr-2" />
                        View Terms
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass-card border-glass-border max-w-xs">
                      <p className="text-sm">Click to view detailed license terms and conditions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold gradient-text">{license.price}</p>
                  </div>
                  <Button 
                    className="bg-gradient-accent hover:opacity-90 glow-cyan"
                    onClick={() => handlePurchase(license.licenseName)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Purchase
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
