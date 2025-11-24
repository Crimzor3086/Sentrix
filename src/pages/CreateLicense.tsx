import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateLicense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commercialUse, setCommercialUse] = useState(false);
  const [exclusive, setExclusive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("License created successfully!");
    setTimeout(() => {
      navigate(`/ip/${id}`);
    }, 1000);
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
                  <Select required>
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
                    <Select required>
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
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="0.00" 
                      className="glass border-border"
                      required
                    />
                  </div>
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
                  >
                    Publish License
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
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
