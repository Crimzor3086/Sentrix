import { MetricCard } from "@/components/dashboard/MetricCard";
import { ShieldCheck, AlertTriangle, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

const scanActivityData = [
  { month: "Jan", scans: 120 },
  { month: "Feb", scans: 180 },
  { month: "Mar", scans: 150 },
  { month: "Apr", scans: 220 },
  { month: "May", scans: 280 },
  { month: "Jun", scans: 350 },
];

const violationData = [
  { name: "Copyright", value: 35, color: "hsl(var(--neon-orange))" },
  { name: "Trademark", value: 25, color: "hsl(var(--neon-blue))" },
  { name: "License", value: 20, color: "hsl(var(--neon-cyan))" },
  { name: "Other", value: 20, color: "hsl(var(--muted-foreground))" },
];

const riskTrendData = [
  { week: "W1", risk: 65 },
  { week: "W2", risk: 72 },
  { week: "W3", risk: 58 },
  { week: "W4", risk: 45 },
  { week: "W5", risk: 38 },
  { week: "W6", risk: 42 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor AI compliance and IP licensing metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Scans"
          value="1,284"
          icon={FileText}
          trend={{ value: "+12.5% from last month", positive: true }}
          variant="primary"
        />
        <MetricCard
          title="Safe Outputs"
          value="1,127"
          icon={ShieldCheck}
          trend={{ value: "+8.2% from last month", positive: true }}
          variant="secondary"
        />
        <MetricCard
          title="Violations Detected"
          value="157"
          icon={AlertTriangle}
          trend={{ value: "-3.1% from last month", positive: true }}
          variant="accent"
        />
        <MetricCard
          title="Pending Licenses"
          value="23"
          icon={Clock}
          trend={{ value: "+2 new this week", positive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Monthly Scan Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scanActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6, className: "glow-primary" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Violations by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={violationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {violationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Risk Score Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={riskTrendData}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="week" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area 
                type="monotone" 
                dataKey="risk" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#riskGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
