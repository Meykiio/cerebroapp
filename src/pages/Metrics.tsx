
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Import components
import MetricsOverview from "@/components/metrics/MetricsOverview";
import CustomKpiForm from "@/components/metrics/CustomKpiForm";
import CustomKpisList from "@/components/metrics/CustomKpisList";
import { KpiData } from "@/types/metrics";

// Import sample data
import { 
  combineChartData, 
  combineCustomerData, 
  sampleChannelData, 
  sampleProductData 
} from "@/data/sampleMetricsData";

// Main Metrics Component
const Metrics = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddKpi, setShowAddKpi] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KpiData | null>(null);
  const [customKpis, setCustomKpis] = useState<KpiData[]>([
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
  const handleSaveKpi = (kpiData: KpiData) => {
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
  const handleDeleteKpi = (id: number) => {
    setCustomKpis(customKpis.filter(kpi => kpi.id !== id));
    toast.success("KPI deleted successfully");
  };
  
  // Handle editing a KPI
  const handleEditKpi = (kpi: KpiData) => {
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
  
  // Prepare data for charts
  const revenueChartData = combineChartData();
  const customerChartData = combineCustomerData();
  
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
                {selectedTimeframe}
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
        
        <TabsContent value="overview">
          <MetricsOverview 
            selectedTimeframe={selectedTimeframe}
            sampleRevenueData={revenueChartData}
            sampleCustomerData={customerChartData}
            sampleChannelData={sampleChannelData}
            sampleProductData={sampleProductData}
          />
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
            <CustomKpisList 
              customKpis={customKpis}
              onAddKpi={() => setShowAddKpi(true)}
              onEditKpi={handleEditKpi}
              onDeleteKpi={handleDeleteKpi}
              showAddKpi={showAddKpi}
            />
          )}
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
