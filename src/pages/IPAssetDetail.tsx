import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Hash, Globe, ArrowLeft, Plus, Award } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function IPAssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const asset = {
    title: "Digital Art Collection #42",
    tokenId: "0x7a2f894b3c1e6d8a9f2b5c7e3a1d4b8f9c2e5a7b",
    category: "Digital Art",
    status: "active",
    thumbnail: "🎨",
    mintedDate: "2024-01-15",
    creator: "0x8a3b...f2c9",
    description: "A unique collection of generative digital art featuring abstract patterns and vibrant colors.",
  };

  const licenses = [
    { id: 1, name: "Commercial License", type: "Commercial", status: "Active", issued: "2024-02-01" },
    { id: 2, name: "Educational Use", type: "Non-Commercial", status: "Active", issued: "2024-01-20" },
  ];

  const activities = [
    { id: 1, action: "License Issued", details: "Commercial License created", date: "2024-02-01" },
    { id: 2, action: "Metadata Updated", details: "Description modified", date: "2024-01-25" },
    { id: 3, action: "IP Registered", details: "Asset minted on Story Protocol", date: "2024-01-15" },
  ];

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
            <div className="aspect-square bg-gradient-primary/10 flex items-center justify-center text-9xl border-b border-border">
              {asset.thumbnail}
            </div>
            <div className="p-6 space-y-4">
              <Badge variant="default">{asset.status}</Badge>
              <Button className="w-full bg-gradient-primary hover:opacity-90 glow-purple" asChild>
                <Link to={`/ip/${id}/license`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create License
                </Link>
              </Button>
              <Button variant="outline" className="w-full glass">
                <Award className="mr-2 h-4 w-4" />
                View Certificate
              </Button>
            </div>
          </Card>

          {/* Asset Info */}
          <Card className="glass-card lg:col-span-2 p-6">
            <h1 className="text-3xl font-bold mb-2 gradient-text">{asset.title}</h1>
            <p className="text-muted-foreground mb-6">{asset.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Token ID</p>
                  <code className="text-sm font-mono break-all">{asset.tokenId}</code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Minted Date</p>
                  <p className="text-sm font-medium">{asset.mintedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-sm font-medium">{asset.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Creator</p>
                  <code className="text-sm font-mono">{asset.creator}</code>
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
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>License Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issued</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licenses.map((license) => (
                    <TableRow key={license.id} className="border-border">
                      <TableCell className="font-medium">{license.name}</TableCell>
                      <TableCell>{license.type}</TableCell>
                      <TableCell>
                        <Badge variant="default">{license.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{license.issued}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="activity" className="p-6">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="p-6">
              <div className="space-y-4">
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Chain</p>
                  <p className="font-medium">Story Protocol</p>
                </div>
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Standard</p>
                  <p className="font-medium">IP-NFT (ERC-721)</p>
                </div>
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">License Framework</p>
                  <p className="font-medium">Story Programmable IP License</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
