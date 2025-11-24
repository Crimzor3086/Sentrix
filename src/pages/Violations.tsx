import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, ExternalLink, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Violations() {
  const violations = [
    {
      id: 1,
      url: "unauthorized-site.com/artwork",
      asset: "Digital Art Collection #42",
      matchScore: 98,
      status: "investigating",
      reportedDate: "2024-01-20",
    },
    {
      id: 2,
      url: "copycat-store.com/products",
      asset: "Brand Logo Design",
      matchScore: 95,
      status: "resolved",
      reportedDate: "2024-01-15",
    },
    {
      id: 3,
      url: "media-platform.com/music",
      asset: "Summer Vibes Track",
      matchScore: 87,
      status: "open",
      reportedDate: "2024-01-18",
    },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "resolved": return "default";
      case "investigating": return "secondary";
      case "open": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Violation Reports</h1>
          <p className="text-muted-foreground">Monitor and manage unauthorized IP usage</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Violations</p>
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <Search className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold">1</p>
            <p className="text-xs text-muted-foreground mt-1">Enforcement successful</p>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Under Investigation</p>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">1</p>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </Card>
        </div>

        {/* Violations Table */}
        {violations.length > 0 ? (
          <Card className="glass-card">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold">Detected Violations</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Suspicious URL</TableHead>
                  <TableHead>IP Asset</TableHead>
                  <TableHead>Match Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {violations.map((violation) => (
                  <TableRow key={violation.id} className="border-border hover:bg-muted/50">
                    <TableCell>
                      <a 
                        href={`https://${violation.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        {violation.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell className="font-medium">{violation.asset}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${violation.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{violation.matchScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(violation.status)} className="capitalize">
                        {violation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{violation.reportedDate}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="glass">
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="glass-card p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No Violations Detected</h3>
              <p className="text-muted-foreground">
                Great news! Your IP assets are being monitored and no unauthorized usage has been detected.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
