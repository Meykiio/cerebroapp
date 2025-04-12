import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, ComposedChart, Legend
} from "recharts";
import { Brain, TrendingUp, BarChart3, PlusCircle, RefreshCw, Calendar, Download, Filter, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const kpiData = {
  revenue: [
    { month: 'Jan', value: 12000 },
    { month: 'Feb', value: 15000 },
    { month: 'Mar', value: 18000 },
    { month: 'Apr', value: 17000 },
    { month: 'May', value: 21000 },
    { month: 'Jun', value: 25000 },
    { month: 'Jul', value: 28000 },
    { month: 'Aug', value: 30000 },
    { month: 'Sep', value: 32000 },
    { month: 'Oct', value: 35000 },
    { month: 'Nov', value: 37000 },
    { month: 'Dec', value: 40000 },
  ],
  customers: [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 140 },
    { month: 'Mar', value: 170 },
    { month: 'Apr', value: 190 },
    { month: 'May', value: 210 },
    { month: 'Jun', value: 230 },
    { month: 'Jul', value: 250 },
    { month: 'Aug', value: 270 },
    { month: 'Sep', value: 290 },
    { month: 'Oct', value: 310 },
    { month: 'Nov', value: 330 },
    { month: 'Dec', value: 350 },
  ],
  cac: [
    { month: 'Jan', value: 80 },
    { month: 'Feb', value: 82 },
    { month: 'Mar', value: 79 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 72 },
    { month: 'Jun', value: 70 },
    { month: 'Jul', value: 68 },
    { month: 'Aug', value: 65 },
    { month: 'Sep', value: 63 },
    { month: 'Oct', value: 60 },
    { month: 'Nov', value: 58 },
    { month: 'Dec', value: 55 },
  ],
  churn: [
    { month: 'Jan', value: 5.2 },
    { month: 'Feb', value: 4.8 },
    { month: 'Mar', value: 4.5 },
    { month: 'Apr', value: 4.7 },
    { month: 'May', value: 4.3 },
    { month: 'Jun', value: 4.0 },
    { month: 'Jul', value: 3.8 },
    { month: 'Aug', value: 3.6 },
    { month: 'Sep', value: 3.4 },
    { month: 'Oct', value: 3.2 },
    { month: 'Nov', value: 3.0 },
    { month: 'Dec', value: 2.8 },
  ],
  conversion: [
    { month: 'Jan', value: 2.1 },
    { month: 'Feb', value: 2.3 },
    { month: 'Mar', value: 2.5 },
    { month: 'Apr', value: 2.7 },
    { month: 'May', value: 3.0 },
    { month: 'Jun', value: 3.2 },
    { month: 'Jul', value: 3.5 },
    { month: 'Aug', value: 3.7 },
    { month: 'Sep', value: 3.9 },
    { month: 'Oct', value: 4.1 },
    { month: 'Nov', value: 4.3 },
    { month: 'Dec', value: 4.5 },
  ],
  profitMargin: [
    { month: 'Jan', value: 15 },
    { month: 'Feb', value: 16 },
    { month: 'Mar', value: 18 },
    { month: 'Apr', value: 17 },
    { month: 'May', value: 19 },
    { month: 'Jun', value: 21 },
    { month: 'Jul', value: 22 },
    { month: 'Aug', value: 23 },
    { month: 'Sep', value: 24 },
    { month: 'Oct', value: 25 },
    { month: 'Nov', value: 26 },
    { month: 'Dec', value: 27 },
  ],
};

const kpiInsights = {
  revenue: "Revenue is growing steadily at an average of 15% month over month, with a particularly strong performance in Q4. The annual growth trajectory suggests a 233% increase from January to December, significantly exceeding industry benchmarks.",
  customers: "Customer acquisition shows consistent growth with an average monthly increase of 8.6%. The customer base has nearly tripled in the past year, indicating strong market penetration and effective acquisition strategies.",
  cac: "Customer acquisition cost is steadily decreasing, dropping from $80 to $55 (31% reduction) over the year. This suggests improved marketing efficiency and better targeting. Continue focusing on your highest ROI channels for further optimization.",
  churn: "Churn rate has improved dramatically from 5.2% to 2.8%, representing a 46% reduction. This demonstrates significantly better product-market fit, enhanced customer satisfaction, and effective retention strategies.",
  conversion: "Conversion rate has more than doubled from 2.1% to 4.5%, showing substantial improvements in marketing effectiveness and user experience. This metric contributes directly to your revenue growth and suggests your funnel optimization efforts are working.",
  profitMargin: "Profit margin has increased from 15% to 27%, reflecting improved operational efficiency, better pricing strategies, and economies of scale as your business grows. Continue monitoring costs while maintaining product quality.",
};

const combinedData = kpiData.revenue.map((item, index) => ({
  month: item.month,
  revenue: item.value,
  customers: kpiData.customers[index].value,
  churn: kpiData.churn[index].value,
  cac: kpiData.cac[index].value,
  conversion: kpiData.conversion[index].value,
  profitMargin: kpiData.profitMargin[index].value,
}));

const MetricsPage = () => {
  const [currentTab, setCurrentTab] = useState("revenue");
  const [dateRange, setDateRange] = useState("year");
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [viewType, setViewType] = useState("line");
  
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
    conversion: calculateChange(kpiData.conversion),
    profitMargin: calculateChange(kpiData.profitMargin),
  };

  const getFilteredData = (data: any[], range: string) => {
    if (range === "month") return data.slice(-1);
    if (range === "quarter") return data.slice(-3);
    if (range === "halfYear") return data.slice(-6);
    return data; // year
  };

  const handleDownloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(kpiData[currentTab as keyof typeof kpiData]));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${currentTab}_metrics.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">KPI Metrics</h1>
          <p className="text-cerebro-soft/70">Track and analyze your business performance</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Dialog open={isAddMetricOpen} onOpenChange={setIsAddMetricOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Metric
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 text-cerebro-soft">
              <DialogHeader>
                <DialogTitle>Add New KPI Metric</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="metricName">Metric Name</Label>
                  <Input id="metricName" placeholder="e.g., Average Order Value" className="bg-gray-800/60 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metricType">Metric Type</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800/60 border-white/10">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/10">
                      <SelectItem value="currency">Currency</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="ratio">Ratio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metricGoal">Target Goal</Label>
                  <Input id="metricGoal" placeholder="e.g., 100" className="bg-gray-800/60 border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-cerebro-purple hover:bg-cerebro-purple-dark" onClick={() => setIsAddMetricOpen(false)}>
                    Add Metric
                  </Button>
                  <Button variant="outline" className="border-white/10" onClick={() => setIsAddMetricOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px] bg-gray-800/60 border-white/10">
              <SelectValue placeholder="Time Range">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{dateRange}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-white/10">
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="halfYear">Last 6 Months</SelectItem>
              <SelectItem value="year">Full Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="border-white/10" onClick={handleDownloadData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button variant="outline" className="border-white/10">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
        
        <Card className="bg-gray-900/60 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-cerebro-soft/70">Conversion Rate</p>
                <p className="text-2xl font-bold">{kpiData.conversion[kpiData.conversion.length-1].value}%</p>
                <div className={`flex items-center mt-1 ${changePercentage.conversion >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <p className="text-sm">{changePercentage.conversion.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Filter className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/60 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-cerebro-soft/70">Profit Margin</p>
                <p className="text-2xl font-bold">{kpiData.profitMargin[kpiData.profitMargin.length-1].value}%</p>
                <div className={`flex items-center mt-1 ${changePercentage.profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <p className="text-sm">{changePercentage.profitMargin.toFixed(1)}%</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900/60 border-white/10">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <TabsTrigger value="conversion" className="data-[state=active]:bg-cerebro-purple">
                  Conversion
                </TabsTrigger>
                <TabsTrigger value="profitMargin" className="data-[state=active]:bg-cerebro-purple">
                  Profit
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger className="w-[120px] bg-gray-800/60 border-white/10">
                  <SelectValue placeholder="Chart Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/10">
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="compare">Compare All</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-white/10 px-2">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {viewType === "line" && (
                    <LineChart data={getFilteredData(kpiData[currentTab as keyof typeof kpiData], dateRange)}>
                      <XAxis dataKey="month" stroke="#F8FAFC60" />
                      <YAxis stroke="#F8FAFC60" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={
                          currentTab === "revenue" ? "#8B5CF6" : 
                          currentTab === "customers" ? "#22D3EE" : 
                          currentTab === "cac" ? "#10B981" : 
                          currentTab === "churn" ? "#F59E0B" :
                          currentTab === "conversion" ? "#A855F7" :
                          "#3B82F6"
                        } 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                      />
                    </LineChart>
                  )}
                  
                  {viewType === "area" && (
                    <AreaChart data={getFilteredData(kpiData[currentTab as keyof typeof kpiData], dateRange)}>
                      <defs>
                        <linearGradient id={`color${currentTab}`} x1="0" y1="0" x2="0" y2="1">
                          <stop 
                            offset="5%" 
                            stopColor={
                              currentTab === "revenue" ? "#8B5CF6" : 
                              currentTab === "customers" ? "#22D3EE" : 
                              currentTab === "cac" ? "#10B981" : 
                              currentTab === "churn" ? "#F59E0B" :
                              currentTab === "conversion" ? "#A855F7" :
                              "#3B82F6"
                            } 
                            stopOpacity={0.8}
                          />
                          <stop 
                            offset="95%" 
                            stopColor={
                              currentTab === "revenue" ? "#8B5CF6" : 
                              currentTab === "customers" ? "#22D3EE" : 
                              currentTab === "cac" ? "#10B981" : 
                              currentTab === "churn" ? "#F59E0B" :
                              currentTab === "conversion" ? "#A855F7" :
                              "#3B82F6"
                            } 
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#F8FAFC60" />
                      <YAxis stroke="#F8FAFC60" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={
                          currentTab === "revenue" ? "#8B5CF6" : 
                          currentTab === "customers" ? "#22D3EE" : 
                          currentTab === "cac" ? "#10B981" : 
                          currentTab === "churn" ? "#F59E0B" :
                          currentTab === "conversion" ? "#A855F7" :
                          "#3B82F6"
                        }
                        fillOpacity={1} 
                        fill={`url(#color${currentTab})`} 
                      />
                    </AreaChart>
                  )}
                  
                  {viewType === "bar" && (
                    <BarChart data={getFilteredData(kpiData[currentTab as keyof typeof kpiData], dateRange)}>
                      <XAxis dataKey="month" stroke="#F8FAFC60" />
                      <YAxis stroke="#F8FAFC60" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Bar 
                        dataKey="value" 
                        fill={
                          currentTab === "revenue" ? "#8B5CF6" : 
                          currentTab === "customers" ? "#22D3EE" : 
                          currentTab === "cac" ? "#10B981" : 
                          currentTab === "churn" ? "#F59E0B" :
                          currentTab === "conversion" ? "#A855F7" :
                          "#3B82F6"
                        }
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                  
                  {viewType === "compare" && (
                    <ComposedChart data={getFilteredData(combinedData, dateRange)}>
                      <XAxis dataKey="month" stroke="#F8FAFC60" />
                      <YAxis yAxisId="left" orientation="left" stroke="#F8FAFC60" />
                      <YAxis yAxisId="right" orientation="right" stroke="#F8FAFC60" />
                      <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                      <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#8B5CF699" stroke="#8B5CF6" fillOpacity={0.3} />
                      <Line yAxisId="right" type="monotone" dataKey="customers" stroke="#22D3EE" />
                      <Line yAxisId="right" type="monotone" dataKey="churn" stroke="#F59E0B" />
                      <Bar yAxisId="left" dataKey="cac" barSize={20} fill="#10B981" />
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="h-full bg-gray-800/30 border-white/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-cerebro-purple" />
                    <h3 className="text-sm font-medium">AI Insight</h3>
                  </div>
                </CardHeader>
                <CardContent className="h-64 overflow-auto">
                  <p className="text-sm text-cerebro-soft/80">
                    {currentTab === "revenue" ? kpiInsights.revenue :
                     currentTab === "customers" ? kpiInsights.customers :
                     currentTab === "cac" ? kpiInsights.cac :
                     currentTab === "churn" ? kpiInsights.churn :
                     currentTab === "conversion" ? kpiInsights.conversion :
                     kpiInsights.profitMargin}
                  </p>
                  
                  <div className="mt-4 p-3 bg-cerebro-purple/10 rounded-md border border-cerebro-purple/20">
                    <h4 className="text-sm font-medium mb-2">AI Recommendations</h4>
                    <ul className="text-xs space-y-2">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-cerebro-purple/20 flex items-center justify-center shrink-0 mr-2">
                          <span className="text-xs">1</span>
                        </div>
                        <span>Focus on improving {currentTab === "revenue" ? "upsell opportunities" : 
                          currentTab === "customers" ? "customer referral programs" : 
                          currentTab === "cac" ? "marketing channel optimization" : 
                          currentTab === "churn" ? "onboarding experience" :
                          currentTab === "conversion" ? "checkout flow" :
                          "cost structure"}</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-cerebro-purple/20 flex items-center justify-center shrink-0 mr-2">
                          <span className="text-xs">2</span>
                        </div>
                        <span>Consider {currentTab === "revenue" ? "bundled pricing strategies" : 
                          currentTab === "customers" ? "expanding to new markets" : 
                          currentTab === "cac" ? "A/B testing ad creatives" : 
                          currentTab === "churn" ? "implementing customer success calls" :
                          currentTab === "conversion" ? "simplified form fields" :
                          "renegotiating supplier contracts"}</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-cerebro-purple/20 flex items-center justify-center shrink-0 mr-2">
                          <span className="text-xs">3</span>
                        </div>
                        <span>Analyze {currentTab === "revenue" ? "seasonal patterns" : 
                          currentTab === "customers" ? "user demographics" : 
                          currentTab === "cac" ? "conversion funnel drop-offs" : 
                          currentTab === "churn" ? "exit surveys" :
                          currentTab === "conversion" ? "heatmap behavior" :
                          "highest margin products"}</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900/60 border-white/10">
        <CardHeader>
          <CardTitle>Forecasted Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpiData[currentTab as keyof typeof kpiData].concat([
                { month: 'Jan (Forecast)', value: currentTab === "revenue" ? 43000 : 
                                          currentTab === "customers" ? 370 :
                                          currentTab === "cac" ? 52 :
                                          currentTab === "churn" ? 2.6 :
                                          currentTab === "conversion" ? 4.7 :
                                          28
                },
                { month: 'Feb (Forecast)', value: currentTab === "revenue" ? 45000 : 
                                          currentTab === "customers" ? 390 :
                                          currentTab === "cac" ? 50 :
                                          currentTab === "churn" ? 2.4 :
                                          currentTab === "conversion" ? 4.9 :
                                          29
                },
                { month: 'Mar (Forecast)', value: currentTab === "revenue" ? 48000 : 
                                          currentTab === "customers" ? 410 :
                                          currentTab === "cac" ? 48 :
                                          currentTab === "churn" ? 2.2 :
                                          currentTab === "conversion" ? 5.1 :
                                          30
                },
              ])}>
                <XAxis dataKey="month" stroke="#F8FAFC60" />
                <YAxis stroke="#F8FAFC60" />
                <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC20" />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={
                    currentTab === "revenue" ? "#8B5CF6" : 
                    currentTab === "customers" ? "#22D3EE" : 
                    currentTab === "cac" ? "#10B981" : 
                    currentTab === "churn" ? "#F59E0B" :
                    currentTab === "conversion" ? "#A855F7" :
                    "#3B82F6"
                  } 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={
                    currentTab === "revenue" ? "#8B5CF6" : 
                    currentTab === "customers" ? "#22D3EE" : 
                    currentTab === "cac" ? "#10B981" : 
                    currentTab === "churn" ? "#F59E0B" :
                    currentTab === "conversion" ? "#A855F7" :
                    "#3B82F6"
                  } 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  data={kpiData[currentTab as keyof typeof kpiData].slice(9)}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-gray-800/50 rounded-md border border-white/10">
            <h4 className="text-sm font-medium mb-1">Growth Prediction</h4>
            <p className="text-xs text-cerebro-soft/80">
              Based on current trends and market conditions, we predict your {currentTab} will 
              {currentTab === "revenue" || currentTab === "customers" || currentTab === "conversion" || currentTab === "profitMargin" 
                ? " continue to grow at approximately " + 
                  (currentTab === "revenue" ? "7" : 
                   currentTab === "customers" ? "5.5" : 
                   currentTab === "conversion" ? "4.5" :
                   "3.5") + "% per month"
                : " continue to decrease by approximately " +
                  (currentTab === "cac" ? "3.5" : "7") + "% per month"
              } 
              over the next quarter, assuming current business strategies remain consistent.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsPage;
