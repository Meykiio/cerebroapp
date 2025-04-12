
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import KpiCard from "./KpiCard";
import { LineChart } from "@tremor/react";
import { TremorDonutChart } from "./TremorCharts";
import { MultiSeriesDataPoint, PieChartDataPoint } from "@/types/metrics";

interface MetricsOverviewProps {
  selectedTimeframe: string;
  sampleRevenueData: MultiSeriesDataPoint[];
  sampleCustomerData: MultiSeriesDataPoint[];
  sampleChannelData: PieChartDataPoint[];
  sampleProductData: PieChartDataPoint[];
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  selectedTimeframe,
  sampleRevenueData,
  sampleCustomerData,
  sampleChannelData,
  sampleProductData
}) => {
  return (
    <div className="space-y-6">
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
                data={sampleRevenueData}
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
                data={sampleCustomerData}
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
              <TremorDonutChart
                data={sampleChannelData}
                index="name"
                category="value"
                colors={["purple", "cyan", "blue", "indigo", "violet"]}
                showLabel={true}
                showAnimation={true}
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
    </div>
  );
};

export default MetricsOverview;
