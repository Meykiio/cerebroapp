
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LineChart, AreaChart, Area, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowDown, ArrowUp, LineChart as LineChartIcon, TrendingDown, TrendingUp } from "lucide-react";
import WidgetWrapper from "./WidgetWrapper";

const data = [
  { name: "Jan", revenue: 4000, users: 2400, cac: 1600 },
  { name: "Feb", revenue: 5000, users: 2800, cac: 1400 },
  { name: "Mar", revenue: 4800, users: 3200, cac: 1200 },
  { name: "Apr", revenue: 5200, users: 3600, cac: 1100 },
  { name: "May", revenue: 5800, users: 4000, cac: 1300 },
  { name: "Jun", revenue: 6600, users: 4200, cac: 1200 },
];

interface MetricCardProps {
  title: string;
  value: string;
  delta: number;
  trend: "up" | "down";
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, delta, trend }) => {
  return (
    <div className="p-3 rounded-md bg-white/5">
      <div className="text-sm text-cerebro-soft/70">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
      <div className={`flex items-center mt-1 text-sm ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
        {trend === "up" ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
        <span>
          {delta}% {trend === "up" ? "increase" : "decrease"}
        </span>
      </div>
    </div>
  );
};

const KpiWidget = () => {
  return (
    <WidgetWrapper title="KPI Metrics" icon={<LineChartIcon className="h-5 w-5 text-green-400" />} className="col-span-full xl:col-span-2">
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MetricCard title="MRR" value="$24,500" delta={8.2} trend="up" />
          <MetricCard title="Active Users" value="4,283" delta={12.5} trend="up" />
          <MetricCard title="CAC" value="$42.25" delta={3.7} trend="down" />
        </div>
        
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#b3b3b3" tickLine={false} />
              <YAxis stroke="#b3b3b3" tickLine={false} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(15, 23, 42, 0.9)", 
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white"
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <Link to="/metrics">
          <Button 
            variant="ghost" 
            className="w-full mt-2 text-cerebro-soft hover:text-white hover:bg-white/10"
          >
            View All Metrics
          </Button>
        </Link>
      </div>
    </WidgetWrapper>
  );
};

export default KpiWidget;
