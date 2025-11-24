import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, FileText, Scale, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { WalletConnectModal } from "@/components/WalletConnectModal";
import { useWallet } from "@/contexts/WalletContext";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { isConnected } = useWallet();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isConnected) {
      navigate("/dashboard");
    } else {
      setShowWalletModal(true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-30"></div>
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-8 animate-float">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Powered by Story Protocol</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Protect Your <span className="gradient-text">Digital IP</span>
              <br />
              On-Chain
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Sentrix is your decentralized IP License Guard. Register, license, and protect your creative assets with blockchain-powered security.
            </p>
            
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="h-14 px-8 text-lg bg-gradient-primary hover:opacity-90 glow-purple transition-smooth group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Complete IP Protection Suite
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="glass-card p-8 hover:glow-purple transition-smooth group">
              <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Register IP</h3>
              <p className="text-muted-foreground leading-relaxed">
                Mint your creative assets as IP tokens on Story Protocol. Immutable proof of ownership secured by blockchain.
              </p>
            </Card>

            <Card className="glass-card p-8 hover:glow-cyan transition-smooth group">
              <div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Scale className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">License IP</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create programmable licenses with custom terms. Control commercial use, territories, and duration automatically.
              </p>
            </Card>

            <Card className="glass-card p-8 hover:glow-purple transition-smooth group">
              <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Protect IP</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automated violation detection monitors the web. Get real-time alerts when unauthorized use is detected.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <Card className="glass-card p-12 text-center max-w-4xl mx-auto border-primary/30">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Secure Your IP?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join creators protecting their work with blockchain technology
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="h-14 px-8 text-lg bg-gradient-primary hover:opacity-90 glow-purple"
            >
              Connect Wallet to Begin
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold gradient-text">Sentrix</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built on Story Protocol • Securing Creative Assets On-Chain
            </p>
          </div>
        </div>
      </footer>

      <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </div>
  );
}
