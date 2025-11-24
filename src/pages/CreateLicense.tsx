import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLicensingContract, parseEther } from "@/lib/contracts";
import { useWallet } from "@/contexts/WalletContext";
import { ZeroAddress } from "ethers";

export default function CreateLicense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isConnected } = useWallet();
  const [commercialUse, setCommercialUse] = useState(false);
  const [exclusive, setExclusive] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    territory: "",
    duration: "",
    licensee: "",
    startDate: "",
    endDate: "",
    fee: "",
    terms: "",
  });

  const encodeTerms = (value: string) => {
    if (!value) return "";
    if (value.startsWith("ipfs://") || value.startsWith("https://") || value.startsWith("http://")) {
      return value;
    }
    const payload = typeof window !== "undefined"
      ? window.btoa(unescape(encodeURIComponent(value)))
      : Buffer.from(value, "utf-8").toString("base64");
    return `data:text/plain;base64,${payload}`;
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Missing asset id");
      }
      if (!formState.fee) {
        throw new Error("Set a license fee");
      }

      const contract = await getLicensingContract();
      const start = formState.startDate ? Math.floor(new Date(formState.startDate).getTime() / 1000) : Math.floor(Date.now() / 1000);
      const end = formState.endDate ? Math.floor(new Date(formState.endDate).getTime() / 1000) : 0;
      const termsURI = encodeTerms(
        formState.terms ||
          `${formState.name || "Sentrix License"} | territory=${formState.territory || "worldwide"} | duration=${
            formState.duration || "perpetual"
          } | commercial=${commercialUse} | exclusive=${exclusive}`
      );

      const tx = await contract.createLicense(
        BigInt(id),
        start,
        end,
        parseEther(formState.fee),
        termsURI,
        formState.licensee || ZeroAddress
      );

      return tx.wait();
    },
    onSuccess: async () => {
      toast.success("License published on-chain");
      await queryClient.invalidateQueries({ queryKey: ["assetLicenses", id] });
      await queryClient.invalidateQueries({ queryKey: ["openLicenses"] });
      navigate(`/ip/${id}`);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to publish license";
      toast.error(message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Connect your wallet first");
      return;
    }
    await mutateAsync();
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 glass"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Create License</h1>
            <p className="text-muted-foreground">Set terms for your programmable IP license</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Form */}
            <Card className="glass-card md:col-span-2 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">License Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Commercial Use License" 
                    className="glass border-border"
                    value={formState.name}
                    onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                    required
                  />
                </div>

                <div className="flex items-center justify-between glass p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Commercial Use</Label>
                    <p className="text-sm text-muted-foreground">Allow commercial usage of IP</p>
                  </div>
                  <Switch checked={commercialUse} onCheckedChange={setCommercialUse} />
                </div>

                <div className="flex items-center justify-between glass p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Exclusive License</Label>
                    <p className="text-sm text-muted-foreground">Grant exclusive rights</p>
                  </div>
                  <Switch checked={exclusive} onCheckedChange={setExclusive} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="territory">Territory</Label>
                  <Select
                    required
                    value={formState.territory}
                    onValueChange={(value) => setFormState((prev) => ({ ...prev, territory: value }))}
                  >
                    <SelectTrigger className="glass border-border">
                      <SelectValue placeholder="Select territory" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-glass-border">
                      <SelectItem value="worldwide">Worldwide</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="asia">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      required
                      value={formState.duration}
                      onValueChange={(value) => setFormState((prev) => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger className="glass border-border">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-glass-border">
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="2years">2 Years</SelectItem>
                        <SelectItem value="5years">5 Years</SelectItem>
                        <SelectItem value="perpetual">Perpetual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (ETH)</Label>
                    <Input 
                      id="price"
                      type="number"
                      step="0.0001"
                      placeholder="0.00"
                      className="glass border-border"
                      value={formState.fee}
                      onChange={(event) => setFormState((prev) => ({ ...prev, fee: event.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      className="glass border-border"
                      value={formState.startDate}
                      onChange={(event) => setFormState((prev) => ({ ...prev, startDate: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      className="glass border-border"
                      value={formState.endDate}
                      onChange={(event) => setFormState((prev) => ({ ...prev, endDate: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licensee">Licensee (optional)</Label>
                  <Input
                    id="licensee"
                    placeholder="0x..."
                    className="glass border-border"
                    value={formState.licensee}
                    onChange={(event) => setFormState((prev) => ({ ...prev, licensee: event.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave blank to create an open listing anyone can accept.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="terms">Terms / Notes</Label>
                  <Textarea
                    id="terms"
                    placeholder="Describe the rights, restrictions, and any off-chain references..."
                    className="glass border-border min-h-[120px]"
                    value={formState.terms}
                    onChange={(event) => setFormState((prev) => ({ ...prev, terms: event.target.value }))}
                  />
                </div>

                <div className="flex gap-4 pt-4">
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
                    {isPending ? "Publishing..." : "Publish License"}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Summary Panel */}
            <div className="space-y-6">
              <Card className="glass-card p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  License Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{commercialUse ? "Commercial" : "Non-Commercial"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Exclusivity</span>
                    <span className="font-medium">{exclusive ? "Exclusive" : "Non-Exclusive"}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-accent">Ready to Publish</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-border">
                    <span className="text-muted-foreground">Listing type</span>
                    <span className="font-medium">
                      {formState.licensee ? "Directed" : "Open"}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h3 className="font-bold mb-4">Terms Preview</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Automated enforcement via smart contract</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Immutable license terms on-chain</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Transparent revenue tracking</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>License terms embedded as on-chain metadata</span>
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
