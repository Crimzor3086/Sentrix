import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@/contexts/WalletContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { encodeMetadataURI } from "@/lib/metadata";
import { getRegistryContract } from "@/lib/contracts";

export default function RegisterIP() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    reference: "",
  });
  const [previewName, setPreviewName] = useState("No reference supplied");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isConnected } = useWallet();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const contract = await getRegistryContract();
      const metadataURI = encodeMetadataURI({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        reference: formData.reference,
        createdAt: Date.now(),
      });

      const tx = await contract.registerAsset(formData.title, formData.category, metadataURI);
      return tx.wait();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["registryAssets"] });
      toast.success("IP asset registered successfully!");
      navigate("/ip/assets");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to register asset";
      toast.error(message);
    },
  });

  const handleReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, reference: value }));
    setPreviewName(value || "No reference supplied");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Connect your wallet before minting");
      return;
    }

    await mutateAsync();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Register IP Asset</h1>
            <p className="text-muted-foreground">Mint your creative work as an on-chain IP token</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Form */}
            <Card className="glass-card md:col-span-2 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">IP Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter asset title"
                    className="glass border-border focus:border-primary"
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    required
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="glass border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-glass-border">
                      <SelectItem value="art">Digital Art</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your IP asset..."
                    className="glass border-border focus:border-primary min-h-[120px]"
                    value={formData.description}
                    onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference">Reference / IPFS CID</Label>
                  <div className="glass border-2 border-dashed border-border rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      <span>Paste a CID, Arweave hash, or HTTPS url</span>
                    </div>
                    <Input
                      id="reference"
                      placeholder="ipfs://..."
                      className="glass border-border focus:border-primary"
                      value={formData.reference}
                      onChange={handleReferenceChange}
                    />
                  </div>
                </div>

                {isPending && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Submitting transaction...</span>
                      <span className="font-medium">Pending</span>
                    </div>
                    <Progress value={100} className="h-2 animate-pulse" />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="glass flex-1"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-primary hover:opacity-90 glow-purple flex-1"
                    disabled={isPending}
                  >
                    {isPending ? "Minting..." : "Mint IP Token"}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Preview Panel */}
            <div className="space-y-6">
              <Card className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Preview
                </h3>
                <div className="space-y-4">
                  <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-sm space-y-2">
                    <p className="text-muted-foreground">{previewName}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  What Happens Next
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">1.</span>
                    Metadata generated
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">2.</span>
                    IP token minted on Story
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">3.</span>
                    Asset registered to you
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">4.</span>
                    Ready to license
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
