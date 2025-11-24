import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-2xl px-6">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Shield className="h-24 w-24 text-primary mx-auto" />
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          </div>
        </div>
        <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          SENTRIX
        </h1>
        <p className="text-2xl text-muted-foreground font-medium">
          Decentralized IP License Guard
        </p>
        <p className="text-lg text-muted-foreground">
          Tokenize intellectual property and protect it on-chain with Story Protocol
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={() => navigate("/scan")} size="lg">
            Get Started
          </Button>
          <Button onClick={() => navigate("/licensing")} variant="outline" size="lg">
            Explore Licenses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
