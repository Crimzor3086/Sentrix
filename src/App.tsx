import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./contexts/WalletContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import RegisterIP from "./pages/RegisterIP";
import IPAssets from "./pages/IPAssets";
import IPAssetDetail from "./pages/IPAssetDetail";
import CreateLicense from "./pages/CreateLicense";
import LicenseMarketplace from "./pages/LicenseMarketplace";
import Violations from "./pages/Violations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/ip/register" element={<ProtectedRoute><RegisterIP /></ProtectedRoute>} />
              <Route path="/ip/assets" element={<ProtectedRoute><IPAssets /></ProtectedRoute>} />
              <Route path="/ip/:id" element={<ProtectedRoute><IPAssetDetail /></ProtectedRoute>} />
              <Route path="/ip/:id/license" element={<ProtectedRoute><CreateLicense /></ProtectedRoute>} />
              <Route path="/licenses" element={<LicenseMarketplace />} />
              <Route path="/violations" element={<ProtectedRoute><Violations /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;
