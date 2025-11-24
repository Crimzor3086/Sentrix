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

export default function RegisterIP() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    toast.success("IP Asset registered successfully!");
    setTimeout(() => {
      navigate("/ip/assets");
    }, 1000);
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select required>
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
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div className="glass border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports images, audio, video, documents (Max 50MB)
                    </p>
                    <Input type="file" className="hidden" id="file-upload" />
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Minting to Story Protocol...</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
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
                    disabled={uploading}
                  >
                    {uploading ? "Minting..." : "Mint IP Token"}
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
                    <p className="text-muted-foreground">No file selected</p>
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
