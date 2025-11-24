import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Scale, AlertTriangle, DollarSign, Plus, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const stats = [
    { icon: FileText, label: "Total IP Assets", value: "12", change: "+2 this month", color: "text-primary" },
    { icon: Scale, label: "Active Licenses", value: "28", change: "+5 this week", color: "text-accent" },
    { icon: AlertTriangle, label: "Violations Detected", value: "3", change: "2 resolved", color: "text-destructive" },
    { icon: DollarSign, label: "Total Revenue", value: "$4,320", change: "+12% this month", color: "text-green-500" },
  ];

  const recentActivity = [
    { id: 1, action: "License Sold", asset: "Digital Art Collection #42", time: "2 hours ago", status: "completed" },
    { id: 2, action: "IP Registered", asset: "Music Track - Summer Vibes", time: "5 hours ago", status: "completed" },
    { id: 3, action: "Violation Detected", asset: "Photo Series Alpha", time: "1 day ago", status: "investigating" },
    { id: 4, action: "License Issued", asset: "Brand Logo Design", time: "2 days ago", status: "active" },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your IP portfolio overview</p>
          </div>
          <Link to="/ip/register">
            <Button className="bg-gradient-primary hover:opacity-90 glow-purple">
              <Plus className="mr-2 h-4 w-4" />
              Register New IP
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card p-6 hover:glow-purple transition-smooth">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl bg-card flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold mb-2">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/ip/register" className="group">
            <Card className="glass-card p-6 hover:glow-purple transition-smooth cursor-pointer h-full">
              <FileText className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Register IP</h3>
              <p className="text-sm text-muted-foreground">Mint new IP assets on-chain</p>
            </Card>
          </Link>

          <Link to="/licenses" className="group">
            <Card className="glass-card p-6 hover:glow-cyan transition-smooth cursor-pointer h-full">
              <Scale className="h-8 w-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Browse Licenses</h3>
              <p className="text-sm text-muted-foreground">Discover IP in marketplace</p>
            </Card>
          </Link>

          <Link to="/violations" className="group">
            <Card className="glass-card p-6 hover:glow-purple transition-smooth cursor-pointer h-full">
              <AlertTriangle className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Check Violations</h3>
              <p className="text-sm text-muted-foreground">Monitor IP protection status</p>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Action</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{activity.action}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.asset}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.time}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={activity.status === "completed" ? "default" : activity.status === "active" ? "secondary" : "destructive"}
                      className="capitalize"
                    >
                      {activity.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
