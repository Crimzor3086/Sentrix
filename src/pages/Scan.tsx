import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScanResult {
  id: string;
  fileName: string;
  status: "safe" | "warning" | "blocked";
  confidence: number;
  issueType?: string;
}

const mockResults: ScanResult[] = [
  { id: "1", fileName: "ai_generated_image_001.png", status: "safe", confidence: 98 },
  { id: "2", fileName: "text_output_marketing.txt", status: "warning", confidence: 72, issueType: "License Required" },
  { id: "3", fileName: "logo_design_v2.svg", status: "blocked", confidence: 95, issueType: "Copyright" },
  { id: "4", fileName: "product_description.md", status: "safe", confidence: 91 },
];

export default function Scan() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);

  const handleScan = () => {
    setIsScanning(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setResults(mockResults);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-accent" />;
      case "blocked":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      safe: "secondary",
      warning: "outline",
      blocked: "destructive",
    };

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Scan AI Output</h1>
        <p className="text-muted-foreground">
          Upload and analyze AI-generated content for compliance
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports images, text, documents, and more
            </p>
            <Button onClick={handleScan} disabled={isScanning}>
              {isScanning ? "Scanning..." : "Start Scan"}
            </Button>
          </div>

          {isScanning && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing files...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Issue Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id} className="hover:bg-muted/50">
                    <TableCell className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {result.fileName}
                    </TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={result.confidence} className="h-2 w-20" />
                        <span className="text-sm">{result.confidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {result.issueType ? (
                        <Badge variant="outline">{result.issueType}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {result.status === "warning" && (
                          <Button size="sm" variant="outline">
                            License
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
