import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type LicenseListing, useOpenLicenses } from "@/hooks/useLicenses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRegistryContract, getLicensingContract, formatEther } from "@/lib/contracts";
import { mapRegistryAsset, RegistryAsset } from "@/hooks/useRegistryAssets";
import { useWallet } from "@/contexts/WalletContext";

type MarketplaceListing = {
  asset: RegistryAsset;
  license: LicenseListing;
};

export default function LicenseMarketplace() {
  const { isConnected } = useWallet();
  const queryClient = useQueryClient();
  const {
    data: openLicenses,
    isLoading,
    isError,
    refetch,
  } = useOpenLicenses();

  const { data: listings, isLoading: assetsLoading } = useQuery({
    queryKey: ["marketplaceListings", openLicenses?.map((license) => license.id)],
    enabled: Boolean(openLicenses && openLicenses.length > 0),
    queryFn: async (): Promise<MarketplaceListing[]> => {
      const contract = await getRegistryContract();
      const enriched = await Promise.all(
        (openLicenses ?? []).map(async (license) => {
          const asset = await contract.getAsset(license.assetId);
          return { asset: mapRegistryAsset(asset), license };
        })
      );
      return enriched;
    },
  });

  const { mutateAsync: purchaseLicense, isPending: isPurchasing } = useMutation({
    mutationFn: async (licenseId: string) => {
      const target = openLicenses?.find((license) => license.id === licenseId);
      if (!target) {
        throw new Error("License not found");
      }
      const contract = await getLicensingContract();
      const tx = await contract.acceptLicense(BigInt(licenseId), { value: target.fee });
      return tx.wait();
    },
    onSuccess: async () => {
      toast.success("License purchased successfully");
      await queryClient.invalidateQueries({ queryKey: ["openLicenses"] });
      await queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to purchase license";
      toast.error(message);
    },
  });

  const handlePurchase = async (licenseId: string) => {
    if (!isConnected) {
      toast.error("Connect your wallet to purchase");
      return;
    }
    await purchaseLicense(licenseId);
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
        {isLoading ? (
          <p className="text-muted-foreground">Loading marketplace...</p>
        ) : isError ? (
          <Card className="glass-card p-12 text-center space-y-4">
            <h3 className="text-2xl font-bold">Unable to load licenses</h3>
            <p className="text-muted-foreground">
              Connect MetaMask to Mantle Sepolia and confirm the Sentrix licensing contract address is configured.
            </p>
            <Button className="bg-gradient-primary" onClick={() => refetch()}>
              Retry
            </Button>
          </Card>
        ) : (listings?.length ?? 0) === 0 ? (
          <Card className="glass-card p-12 text-center space-y-2">
            <h3 className="text-2xl font-bold">No open licenses yet</h3>
            <p className="text-muted-foreground">Creators can publish licenses from the asset detail page.</p>
          </Card>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings?.map(({ asset, license }) => (
            <Card key={license.id} className="glass-card overflow-hidden hover:glow-purple transition-smooth group">
                <div className="aspect-video bg-gradient-primary/10 flex items-center justify-center text-4xl border-b border-border font-semibold">
                  {asset.title.slice(0, 1).toUpperCase()}
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">{asset.title}</p>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-smooth">
                      {license.termsURI ? "Programmable License" : "Custom License"}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="default" className="text-xs capitalize">
                      {asset.category || "General"}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                      Fee locked
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                      Asset #{asset.id}
                  </Badge>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full glass text-xs justify-start" asChild>
                          <a href={license.termsURI} target="_blank" rel="noreferrer">
                        <FileText className="h-3 w-3 mr-2" />
                        View Terms
                          </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="glass-card border-glass-border max-w-xs">
                        <p className="text-sm">Opens the immutable license terms stored on-chain or IPFS.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                      <p className="text-sm text-muted-foreground">Fee</p>
                      <p className="text-2xl font-bold gradient-text">{formatEther(license.fee)} ETH</p>
                  </div>
                  <Button 
                    className="bg-gradient-accent hover:opacity-90 glow-cyan"
                      onClick={() => handlePurchase(license.id)}
                      disabled={isPurchasing}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                      {isPurchasing ? "Processing..." : "Purchase"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
