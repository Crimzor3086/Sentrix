import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, FileText, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type LicenseListing, useOpenLicenses } from "@/hooks/useLicenses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRegistryContract, getLicensingContract, formatEther, parseEther } from "@/lib/contracts";
import { mapRegistryAsset, RegistryAsset, useRegistryAssets } from "@/hooks/useRegistryAssets";
import { useWallet } from "@/contexts/WalletContext";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ZeroAddress } from "ethers";

type MarketplaceListing = {
  asset: RegistryAsset;
  license: LicenseListing;
};

export default function LicenseMarketplace() {
  const { isConnected } = useWallet();
  const { data: ownedAssetsData } = useRegistryAssets();
  const ownedAssets = ownedAssetsData ?? [];
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

  const [listingForm, setListingForm] = useState({
    assetId: "",
    fee: "",
    terms: "",
    licensee: "",
  });

  const { mutateAsync: publishListing, isPending: isPublishing } = useMutation({
    mutationFn: async () => {
      if (!listingForm.assetId) {
        throw new Error("Select an asset to license");
      }
      if (!listingForm.fee) {
        throw new Error("Set a listing fee in ETH");
      }

      const contract = await getLicensingContract();
      const tx = await contract.createLicense(
        BigInt(listingForm.assetId),
        0,
        0,
        parseEther(listingForm.fee),
        listingForm.terms || "",
        listingForm.licensee || ZeroAddress
      );
      return tx.wait();
    },
    onSuccess: async () => {
      toast.success("License listing published");
      setListingForm({ assetId: "", fee: "", terms: "", licensee: "" });
      await queryClient.invalidateQueries({ queryKey: ["assetLicenses"] });
      await queryClient.invalidateQueries({ queryKey: ["openLicenses"] });
      await queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to publish license";
      toast.error(message);
    },
  });

  const handlePublish = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isConnected) {
      toast.error("Connect MetaMask to publish");
      return;
    }
    await publishListing();
  };

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

        {isConnected && (
          <Card className="glass-card p-6 mb-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-muted-foreground">List your IP</p>
                  <h2 className="text-2xl font-bold">Publish a New License</h2>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Buyers pay the fee upfront when they accept your terms. All listings settle on Mantle Sepolia.
                </p>
              </div>

              <form onSubmit={handlePublish} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>IP Asset</Label>
                  {ownedAssets.length > 0 ? (
                    <Select
                      value={listingForm.assetId}
                      onValueChange={(value) => setListingForm((prev) => ({ ...prev, assetId: value }))}
                    >
                      <SelectTrigger className="glass border-border">
                        <SelectValue placeholder="Select registered asset" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-glass-border">
                        {ownedAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            #{asset.id} · {asset.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="Enter asset ID"
                      value={listingForm.assetId}
                      onChange={(event) => setListingForm((prev) => ({ ...prev, assetId: event.target.value }))}
                      className="glass border-border"
                    />
                  )}
                  {ownedAssets.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Mint an IP token on the{" "}
                      <a href="/ip/register" className="underline hover:text-primary">
                        Register IP
                      </a>{" "}
                      page first, then paste its ID here.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Listing Fee (ETH)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="0.00"
                    value={listingForm.fee}
                    onChange={(event) => setListingForm((prev) => ({ ...prev, fee: event.target.value }))}
                    className="glass border-border"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>License Terms (URI or summary)</Label>
                  <Textarea
                    placeholder="ipfs://cid or brief summary of the license terms..."
                    value={listingForm.terms}
                    onChange={(event) => setListingForm((prev) => ({ ...prev, terms: event.target.value }))}
                    className="glass border-border min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste an IPFS/HTTPS link for the full agreement or add a short description (stored on-chain).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Directed Licensee (optional)</Label>
                  <Input
                    placeholder="0x000... (leave blank for open listing)"
                    value={listingForm.licensee}
                    onChange={(event) => setListingForm((prev) => ({ ...prev, licensee: event.target.value }))}
                    className="glass border-border"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    className="bg-gradient-primary hover:opacity-90 glow-purple w-full"
                    disabled={isPublishing}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isPublishing ? "Publishing..." : "Publish Listing"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

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
