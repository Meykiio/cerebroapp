
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Brain, TrendingUp, BarChart3, PlusCircle, RefreshCw } from "lucide-react";

// Sample KPI data
const kpiData = {
  revenue: [
    { month: 'Jan', value: 12000 },
    { month: 'Feb', value: 15000 },
    { month: 'Mar', value: 18000 },
    { month: 'Apr', value: 17000 },
    { month: 'May', value: 21000 },
    { month: 'Jun', value: 25000 },
  ],
  customers: [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 140 },
    { month: 'Mar', value: 170 },
    { month: 'Apr', value: 190 },
    { month: 'May', value: 210 },
    { month: 'Jun', value: 230 },
  ],
  cac: [
    { month: 'Jan', value: 80 },
    { month: 'Feb', value: 82 },
    { month: 'Mar', value: 79 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 72 },
    { month: 'Jun', value: 70 },
  ],
  churn: [
    { month: 'Jan', value: 5.2 },
    { month: 'Feb', value: 4.8 },
    { month: 'Mar', value: 4.5 },
    { month: 'Apr', value: 4.7 },
    { month: 'May', value: 4.3 },
    { month: 'Jun', value: 4.0 },
  ]
};

// KPI summaries from "Gemini"
const kpiInsights = {
  revenue: "Revenue is growing steadily at an average of 15% month over month. June showed the strongest performance with a 19% increase.",
  customers: "Customer acquisition is healthy with consistent growth. Consider analyzing which channels are most effective.",
  cac: "Customer acquisition cost is decreasing, showing improved marketing efficiency. Continue refining your highest ROI channels.",
  churn: "Churn rate has improved from 5.2% to 4%, which indicates better product fit and customer satisfaction."
};

const MetricsPage = () => {
  const [currentTab, setCurrentTab] = useState("revenue");
  
  // Helper function to calculate percentage change
  const calculateChange = (data: {month: string, value: number}[]) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1].value;
    const previous = data[data.length - 2].value;
    return ((current - previous) / previous) * 100;
  };

  const changePercentage = {
    revenue: calculateChange(kpiData.revenue),
    customers: calculateChange(kpiData.customers),
    cac: calculateChange(kpiData.cac),
    churn: calculateChange(kpiData.churn),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">KPI Metrics</h1>
          <p className="text-cerebro-soft/70">Track and analyze your business performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Metric
          </Button>
          <Button variant="outline" className="border-white/10">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <Card className="bg-gray-900/60 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-cerebro-soft/70">Monthly Revenue</p>
                <p className="text-2xl font-bold">${kpiData.revenue[kpiData.revenue.length-1].value.toLocaleString()}</p>
                <div className={`flex items-center mt-1 ${changePercentage.revenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <p className="text-sm">{changePercentage.revenue.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-cerebro-purple/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-cerebro-purple" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="bg-gray-900/60 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-cerebro-soft/70">Total Customers</p>
                <p className="text-2xl font-bold">{kpiData.customers[kpiData.customers.length-1].value}</p>
                <div className={`flex items-center mt-1 ${changePercentage.customers >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <p className="text-sm">{changePercentage.customers.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-cerebro-cyan/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-cerebro-cyan" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CAC Card */}
        <Card className="bg-gray-900/60 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-cerebro-soft/70">Acquisition Cost</p>
                <p className="text-2xl font-bold">${kpiData.cac[kpiData.cac.length-1].value}</p>
                <div className={`flex items-center mt-1 ${changePercentage.cac <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <p className="text-sm">{changePercentage.cac.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Churn Card */}
        <Card className="bg-gray-900/60 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-cerebro-soft/70">Churn Rate</p>
                <p className="text-2xl font-bold">{kpiData.churn[kpiData.churn.length-1].value}%</p>
                <div className={`flex items-center mt-1 ${changePercentage.churn <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <p className="text-sm">{changePercentage.churn.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="bg-gray-900/60 border-white/10">
        <CardHeader className="pb-2">
          <Tabs defaultValue="revenue" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="bg-gray-800/50 border-white/10">
              <TabsTrigger value="revenue" className="data-[state=active]:bg-cerebro-purple">
                Revenue
              </TabsTrigger>
              <TabsTrigger value="customers" className="data-[state=active]:bg-cerebro-purple">
                Customers
              </TabsTrigger>
              <TabsTrigger value="cac" className="data-[state=active]:bg-cerebro-purple">
                CAC
              </TabsTrigger>
              <TabsTrigger value="churn" className="data-[state=active]:bg-cerebro-purple">
                Churn
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {currentTab === "revenue" ? (
                    <AreaChart data={kpiData.revenue}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#F8FAFC60" />
                      <YAxis stroke="#F8FAFC60" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  ) : currentTab === "customers" ? (
                    <LineChart data={kpiData.customers}>
                      <XAxis dataKey="month" stroke="#F8FAFC60" />
                      <YAxis stroke="#F8FAFC60" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#22D3EE" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  ) : currentTab === "cac" ? (
                    <LineChart data={kpiData.cac}>
                      <XAxis dataKey="month" stroke="#F8FAFC60" />
                      <YAxis stroke="#F8FAFC60" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  ) : (
                    <LineChart data={kpiData.churn}>
                      <XAxis dataKey="month" stroke="#F8FAFC60" />
                      <YAxis stroke="#F8FAFC60" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Line type="monotone" dataKey="value" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* AI Insight */}
            <div className="lg:col-span-1">
              <Card className="h-full bg-gray-800/30 border-white/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-cerebro-purple" />
                    <h3 className="text-sm font-medium">Gemini Insight</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-cerebro-soft/80">
                    {currentTab === "revenue" ? kpiInsights.revenue :
                     currentTab === "customers" ? kpiInsights.customers :
                     currentTab === "cac" ? kpiInsights.cac :
                     kpiInsights.churn}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsPage;
