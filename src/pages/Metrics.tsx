import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, BarChart, PieChart, DonutChart } from "@tremor/react";
import { ArrowUpRight, ArrowDownRight, Plus, Trash2, Edit, Save, X, Download, Upload, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Doughnut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Sample data for charts
const sampleRevenueData = [
  { date: "Jan", value: 2400 },
  { date: "Feb", value: 1398 },
  { date: "Mar", value: 9800 },
  { date: "Apr", value: 3908 },
  { date: "May", value: 4800 },
  { date: "Jun", value: 3800 },
  { date: "Jul", value: 4300 },
];

const sampleExpensesData = [
  { date: "Jan", value: 1400 },
  { date: "Feb", value: 1100 },
  { date: "Mar", value: 5800 },
  { date: "Apr", value: 2908 },
  { date: "May", value: 2800 },
  { date: "Jun", value: 2100 },
  { date: "Jul", value: 2300 },
];

const sampleProfitData = [
  { date: "Jan", value: 1000 },
  { date: "Feb", value: 298 },
  { date: "Mar", value: 4000 },
  { date: "Apr", value: 1000 },
  { date: "May", value: 2000 },
  { date: "Jun", value: 1700 },
  { date: "Jul", value: 2000 },
];

const sampleCustomerData = [
  { date: "Jan", value: 40 },
  { date: "Feb", value: 43 },
  { date: "Mar", value: 45 },
  { date: "Apr", value: 52 },
  { date: "May", value: 58 },
  { date: "Jun", value: 62 },
  { date: "Jul", value: 70 },
];

const sampleConversionData = [
  { date: "Jan", value: 2.4 },
  { date: "Feb", value: 2.8 },
  { date: "Mar", value: 3.2 },
  { date: "Apr", value: 3.1 },
  { date: "May", value: 3.8 },
  { date: "Jun", value: 4.2 },
  { date: "Jul", value: 4.5 },
];

const sampleChannelData = [
  { name: "Organic Search", value: 35 },
  { name: "Direct", value: 25 },
  { name: "Social Media", value: 20 },
  { name: "Email", value: 15 },
  { name: "Referral", value: 5 },
];

const sampleProductData = [
  { name: "Product A", value: 40 },
  { name: "Product B", value: 30 },
  { name: "Product C", value: 20 },
  { name: "Product D", value: 10 },
];

// KPI Card Component
const KpiCard = ({ title, value, change, changeType, icon: Icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-cerebro-soft/70">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <div className={`flex items-center mt-1 text-sm ${changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
              {changeType === 'positive' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              <span>{change}</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-lg bg-cerebro-purple/20 flex items-center justify-center">
            <Icon className="h-6 w-6 text-cerebro-purple" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Custom KPI Form Component
const CustomKpiForm = ({ onSave, onCancel, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [target, setTarget] = useState(initialData?.target || "");
  const [current, setCurrent] = useState(initialData?.current || "");
  const [unit, setUnit] = useState(initialData?.unit || "");
  const [chartType, setChartType] = useState(initialData?.chartType || "line");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target || !current || !unit) {
      toast.error("Please fill in all fields");
      return;
    }

    onSave({
      id: initialData?.id || Date.now(),
      name,
      target: parseFloat(target),
      current: parseFloat(current),
      unit,
      chartType,
      progress: (parseFloat(current) / parseFloat(target)) * 100,
      lastUpdated: new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kpi-name">KPI Name</Label>
          <Input 
            id="kpi-name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="e.g. Monthly Revenue"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="kpi-unit">Unit</Label>
          <Input 
            id="kpi-unit" 
            value={unit} 
            onChange={(e) => setUnit(e.target.value)} 
            placeholder="e.g. $, %, users"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="kpi-target">Target Value</Label>
          <Input 
            id="kpi-target" 
            type="number" 
            value={target} 
            onChange={(e) => setTarget(e.target.value)} 
            placeholder="e.g. 10000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="kpi-current">Current Value</Label>
          <Input 
            id="kpi-current" 
            type="number" 
            value={current} 
            onChange={(e) => setCurrent(e.target.value)} 
            placeholder="e.g. 7500"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Chart Type</Label>
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant={chartType === "line" ? "default" : "outline"} 
            onClick={() => setChartType("line")}
            className="flex-1"
          >
            <LineChartIcon className="h-4 w-4 mr-2" />
            Line
          </Button>
          <Button 
            type="button" 
            variant={chartType === "bar" ? "default" : "outline"} 
            onClick={() => setChartType("bar")}
            className="flex-1"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Bar
          </Button>
          <Button 
            type="button" 
            variant={chartType === "pie" ? "default" : "outline"} 
            onClick={() => setChartType("pie")}
            className="flex-1"
          >
            <PieChartIcon className="h-4 w-4 mr-2" />
            Pie
          </Button>
          <Button 
            type="button" 
            variant={chartType === "donut" ? "default" : "outline"} 
            onClick={() => setChartType("donut")}
            className="flex-1"
          >
            <Doughnut className="h-4 w-4 mr-2" />
            Donut
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          {initialData ? "Update KPI" : "Create KPI"}
        </Button>
      </div>
    </form>
  );
};

// Custom KPI Card Component
const CustomKpiCard = ({ kpi, onEdit, onDelete }) => {
  const progress = Math.min(100, (kpi.current / kpi.target) * 100);
  const formattedDate = new Date(kpi.lastUpdated).toLocaleDateString();
  
  // Generate chart data
  const chartData = [
    { name: "Current", value: kpi.current },
    { name: "Remaining", value: Math.max(0, kpi.target - kpi.current) }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{kpi.name}</CardTitle>
            <CardDescription>Last updated: {formattedDate}</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(kpi)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(kpi.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-2xl font-bold">{kpi.current}{kpi.unit}</span>
            <span className="text-cerebro-soft/70 ml-1">/ {kpi.target}{kpi.unit}</span>
          </div>
          <div className="text-sm font-medium">
            {progress.toFixed(1)}% Complete
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
          <div 
            className="bg-cerebro-purple h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="h-32 mt-4">
          {kpi.chartType === "line" && (
            <LineChart 
              data={[
                { date: "Previous", value: kpi.current * 0.8 },
                { date: "Current", value: kpi.current },
                { date: "Target", value: kpi.target }
              ]}
              index="date"
              categories={["value"]}
              colors={["purple"]}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              yAxisWidth={40}
            />
          )}
          {kpi.chartType === "bar" && (
            <BarChart 
              data={[
                { name: "Current", value: kpi.current },
                { name: "Target", value: kpi.target }
              ]}
              index="name"
              categories={["value"]}
              colors={["purple"]}
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              yAxisWidth={40}
            />
          )}
          {kpi.chartType === "pie" && (
            <PieChart 
              data={chartData}
              index="name"
              category="value"
              colors={["purple", "gray"]}
              showLabel={false}
              showAnimation={true}
            />
          )}
          {kpi.chartType === "donut" && (
            <DonutChart 
              data={chartData}
              index="name"
              category="value"
              colors={["purple", "gray"]}
              showLabel={false}
              showAnimation={true}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Metrics Component
const Metrics = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddKpi, setShowAddKpi] = useState(false);
  const [editingKpi, setEditingKpi] = useState(null);
  const [customKpis, setCustomKpis] = useState([
    {
      id: 1,
      name: "Monthly Revenue",
      target: 10000,
      current: 7500,
      unit: "$",
      chartType: "line",
      progress: 75,
      lastUpdated: "2023-07-15T10:30:00Z"
    },
    {
      id: 2,
      name: "New Customers",
      target: 100,
      current: 68,
      unit: "",
      chartType: "bar",
      progress: 68,
      lastUpdated: "2023-07-14T14:45:00Z"
    },
    {
      id: 3,
      name: "Conversion Rate",
      target: 5,
      current: 3.8,
      unit: "%",
      chartType: "donut",
      progress: 76,
      lastUpdated: "2023-07-16T09:15:00Z"
    }
  ]);
  
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Month");
  
  // Handle saving a new or edited KPI
  const handleSaveKpi = (kpiData) => {
    if (editingKpi) {
      setCustomKpis(customKpis.map(kpi => 
        kpi.id === kpiData.id ? kpiData : kpi
      ));
      setEditingKpi(null);
      toast.success("KPI updated successfully");
    } else {
      setCustomKpis([...customKpis, kpiData]);
      toast.success("New KPI created successfully");
    }
    setShowAddKpi(false);
  };
  
  // Handle deleting a KPI
  const handleDeleteKpi = (id) => {
    setCustomKpis(customKpis.filter(kpi => kpi.id !== id));
    toast.success("KPI deleted successfully");
  };
  
  // Handle editing a KPI
  const handleEditKpi = (kpi) => {
    setEditingKpi(kpi);
    setShowAddKpi(true);
  };
  
  // Handle importing KPIs
  const handleImportKpis = () => {
    // This would typically open a file dialog and parse a JSON/CSV file
    toast.info("Import functionality would be implemented here");
  };
  
  // Handle exporting KPIs
  const handleExportKpis = () => {
    // This would typically generate a JSON/CSV file for download
    const dataStr = JSON.stringify(customKpis, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'cerebro-kpis.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("KPIs exported successfully");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-cerebro-soft">KPI Metrics</h1>
          <p className="text-cerebro-soft/70">Track and analyze your key performance indicators</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                {selectedTimeframe || "Select timeframe"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="This Week">This Week</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="This Quarter">This Quarter</SelectItem>
              <SelectItem value="This Year">This Year</SelectItem>
              <SelectItem value="Custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleImportKpis}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Button variant="outline" onClick={handleExportKpis}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="custom">Custom KPIs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard 
              title="Total Revenue" 
              value="$9,800" 
              change="12% from last month" 
              changeType="positive" 
              icon={BarChart3} 
            />
            <KpiCard 
              title="Total Expenses" 
              value="$5,800" 
              change="5% from last month" 
              changeType="negative" 
              icon={BarChart3} 
            />
            <KpiCard 
              title="New Customers" 
              value="45" 
              change="8% from last month" 
              changeType="positive" 
              icon={BarChart3} 
            />
            <KpiCard 
              title="Conversion Rate" 
              value="3.2%" 
              change="0.4% from last month" 
              changeType="positive" 
              icon={BarChart3} 
            />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly comparison for {selectedTimeframe}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart
                    data={sampleRevenueData.map((item, i) => ({
                      date: item.date,
                      Revenue: item.value,
                      Expenses: sampleExpensesData[i].value,
                      Profit: sampleProfitData[i].value
                    }))}
                    index="date"
                    categories={["Revenue", "Expenses", "Profit"]}
                    colors={["purple", "red", "green"]}
                    yAxisWidth={60}
                    showLegend={true}
                    showXAxis={true}
                    showYAxis={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customers and conversion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart
                    data={sampleCustomerData.map((item, i) => ({
                      date: item.date,
                      "New Customers": item.value,
                      "Conversion Rate (%)": sampleConversionData[i].value
                    }))}
                    index="date"
                    categories={["New Customers", "Conversion Rate (%)"]}
                    colors={["purple", "cyan"]}
                    yAxisWidth={60}
                    showLegend={true}
                    showXAxis={true}
                    showYAxis={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Distribution of website traffic by channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <DonutChart
                    data={sampleChannelData}
                    index="name"
                    category="value"
                    colors={["purple", "cyan", "blue", "indigo", "violet"]}
                    showLabel={true}
                    showAnimation={true}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Product</CardTitle>
                <CardDescription>Distribution of revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={sampleProductData}
                    index="name"
                    categories={["value"]}
                    colors={["purple"]}
                    showLegend={false}
                    showXAxis={true}
                    showYAxis={true}
                    yAxisWidth={40}
                    valueFormatter={(value) => `${value}%`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-6">
          {showAddKpi ? (
            <Card>
              <CardHeader>
                <CardTitle>{editingKpi ? "Edit KPI" : "Add New KPI"}</CardTitle>
                <CardDescription>
                  {editingKpi 
                    ? "Update the details of your existing KPI" 
                    : "Create a custom KPI to track your business goals"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomKpiForm 
                  onSave={handleSaveKpi} 
                  onCancel={() => {
                    setShowAddKpi(false);
                    setEditingKpi(null);
                  }}
                  initialData={editingKpi}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="flex justify-end">
              <Button onClick={() => setShowAddKpi(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New KPI
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customKpis.map(kpi => (
              <CustomKpiCard 
                key={kpi.id} 
                kpi={kpi} 
                onEdit={handleEditKpi} 
                onDelete={handleDeleteKpi} 
              />
            ))}
            
            {customKpis.length === 0 && !showAddKpi && (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-cerebro-purple/20 flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-cerebro-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Custom KPIs Yet</h3>
                  <p className="text-cerebro-soft/70 mb-4">
                    Create custom KPIs to track metrics that matter to your business
                  </p>
                  <Button onClick={() => setShowAddKpi(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First KPI
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-cerebro-purple/20 flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-cerebro-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reports Coming Soon</h3>
              <p className="text-cerebro-soft/70 mb-4 max-w-md">
                We're working on advanced reporting features to help you analyze your KPIs in depth.
                Stay tuned for updates!
              </p>
              <Button variant="outline">
                Request Early Access
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Metrics;
