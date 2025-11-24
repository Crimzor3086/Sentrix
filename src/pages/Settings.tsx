import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, User, Bell, Shield, LogOut } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export default function Settings() {
  const { address, disconnect } = useWallet();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected");
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Account Section */}
            <Card className="glass-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Account</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Connected Wallet</Label>
                  <div className="mt-2 glass p-4 rounded-lg">
                    <code className="text-sm font-mono break-all">{address}</code>
                  </div>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="destructive" 
                    onClick={handleDisconnect}
                    className="w-full md:w-auto"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect Wallet
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notifications Section */}
            <Card className="glass-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Notifications</h2>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about license sales and violations
                    </p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>
              </div>
            </Card>

            {/* Security Section */}
            <Card className="glass-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Security & Privacy</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium">Blockchain Security</p>
                    <p className="text-sm text-muted-foreground">
                      Your IP assets are secured by Story Protocol's immutable blockchain infrastructure
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium">Privacy Protected</p>
                    <p className="text-sm text-muted-foreground">
                      Your personal data is never stored on-chain. Only wallet addresses and IP metadata are public.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Preferences Section */}
            <Card className="glass-card">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Preferences</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="glass p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Additional preference options coming soon
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
