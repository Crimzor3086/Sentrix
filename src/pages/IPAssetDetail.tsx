import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Hash, Globe, ArrowLeft, Plus, Award } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRegistryAsset } from "@/hooks/useRegistryAssets";
import { LicenseStatus, useAssetLicenses } from "@/hooks/useLicenses";
import { formatEther } from "@/lib/contracts";
import { useWallet } from "@/contexts/WalletContext";

const licenseBadge = (status: LicenseStatus) => {
  switch (status) {
    case LicenseStatus.Active:
      return { label: "Active", variant: "default" as const };
    case LicenseStatus.Revoked:
      return { label: "Revoked", variant: "destructive" as const };
    default:
      return { label: "Pending", variant: "secondary" as const };
  }
};

const formatDate = (timestamp?: number) => {
  if (!timestamp) return "—";
  const ms = timestamp < 10_000_000_000 ? timestamp * 1000 : timestamp;
  return new Date(ms).toLocaleString();
};

const truncate = (value?: string) => {
  if (!value) return "—";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

export default function IPAssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useWallet();
  const assetId = id ?? "";
  const { data: asset, isLoading, isError, refetch } = useRegistryAsset(assetId);
  const {
    data: licenses,
    isLoading: licensesLoading,
    refetch: refetchLicenses,
  } = useAssetLicenses(assetId);

  if (!assetId) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <Card className="glass-card p-12 text-center space-y-2">
            <h2 className="text-2xl font-bold">Asset ID missing</h2>
            <p className="text-muted-foreground">Use a valid URL such as /ip/1 to load on-chain metadata.</p>
            <Button className="mt-4" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <Card className="glass-card p-12 text-center space-y-4">
            <h2 className="text-2xl font-bold">Unable to load asset</h2>
            <p className="text-muted-foreground">
              Double-check that the Sentrix registry contract is deployed on the connected network.
            </p>
            <Button className="bg-gradient-primary hover:opacity-90" onClick={() => refetch()}>
              Retry
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading || !asset) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="glass-card p-6 space-y-4 animate-pulse">
                <div className="aspect-video bg-muted/20 rounded-lg" />
                <div className="h-6 bg-muted/20 rounded" />
                <div className="h-4 bg-muted/10 rounded" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const canCreateLicense = address && asset.owner.toLowerCase() === address.toLowerCase();
  const description = asset.description || "Metadata stored on-chain for this asset.";
  const referenceUrl = asset.reference && asset.reference.startsWith("ipfs://")
    ? `https://ipfs.io/ipfs/${asset.reference.replace("ipfs://", "")}`
    : asset.reference;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 glass"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assets
        </Button>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Asset Preview */}
          <Card className="glass-card lg:col-span-1">
            <div className="aspect-square bg-gradient-primary/10 flex items-center justify-center text-6xl border-b border-border font-semibold">
              {asset.title.slice(0, 2).toUpperCase()}
            </div>
            <div className="p-6 space-y-4">
              <Badge variant="secondary" className="capitalize">
                {asset.category || "Uncategorized"}
              </Badge>
              <Button
                className="w-full bg-gradient-primary hover:opacity-90 glow-purple"
                asChild
                disabled={!canCreateLicense}
              >
                <Link to={`/ip/${id}/license`}>
                  <Plus className="mr-2 h-4 w-4" />
                  {canCreateLicense ? "Create License" : "Only owner can license"}
                </Link>
              </Button>
              {referenceUrl && (
                <Button variant="outline" className="w-full glass" asChild>
                  <a href={referenceUrl} target="_blank" rel="noreferrer">
                    <Award className="mr-2 h-4 w-4" />
                    View Reference
                  </a>
                </Button>
              )}
            </div>
          </Card>

          {/* Asset Info */}
          <Card className="glass-card lg:col-span-2 p-6">
            <h1 className="text-3xl font-bold mb-2 gradient-text">{asset.title}</h1>
            <p className="text-muted-foreground mb-6">{description}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Asset ID</p>
                  <code className="text-sm font-mono break-all">#{asset.id}</code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Registered</p>
                  <p className="text-sm font-medium">{formatDate(asset.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-sm font-medium capitalize">{asset.category || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <code className="text-sm font-mono">{truncate(asset.owner)}</code>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="glass-card">
          <Tabs defaultValue="licenses" className="w-full">
            <div className="border-b border-border px-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="licenses">Licenses</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="licenses" className="p-6">
              {licensesLoading ? (
                <p className="text-sm text-muted-foreground">Loading licenses...</p>
              ) : licenses && licenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border">
                      <TableHead>ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Licensee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenses.map((license) => {
                      const badge = licenseBadge(license.status);
                      return (
                        <TableRow key={license.id} className="border-border">
                          <TableCell className="font-medium">#{license.id}</TableCell>
                          <TableCell>
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </TableCell>
                          <TableCell>{formatEther(license.fee)} ETH</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(license.startDate)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {license.endDate ? formatDate(license.endDate) : "Open"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {license.licensee && license.licensee !== "0x0000000000000000000000000000000000000000"
                              ? truncate(license.licensee)
                              : "Open listing"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center space-y-2">
                  <p className="font-medium">No licenses published yet</p>
                  <p className="text-sm text-muted-foreground">
                    Publish a new license to monetize this asset.
                  </p>
                  <Button size="sm" onClick={() => refetchLicenses()}>
                    Refresh
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="p-6">
              <Card className="glass-card p-6 text-center">
                <p className="font-medium mb-2">On-chain events coming soon</p>
                <p className="text-sm text-muted-foreground">
                  We’ll surface registry + licensing events here once indexer support is wired up.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="metadata" className="p-6">
              <div className="space-y-4">
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Metadata URI</p>
                  <a
                    href={asset.metadataURI}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm break-all text-primary hover:underline"
                  >
                    {asset.metadataURI}
                  </a>
                </div>
                {referenceUrl && (
                  <div className="glass p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Reference</p>
                    <a
                      href={referenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline break-all"
                    >
                      {referenceUrl}
                    </a>
                  </div>
                )}
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Chain</p>
                  <p className="font-medium">Story Protocol-compatible EVM</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
