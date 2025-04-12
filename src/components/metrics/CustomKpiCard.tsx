
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { LineChart, BarChart } from "@tremor/react";
import { KpiData } from "@/types/metrics";
import { TremorPieChart } from "./TremorCharts";
import { TremorDonutChart } from "./TremorCharts";

interface CustomKpiCardProps {
  kpi: KpiData;
  onEdit: (kpi: KpiData) => void;
  onDelete: (id: number) => void;
}

const CustomKpiCard: React.FC<CustomKpiCardProps> = ({ kpi, onEdit, onDelete }) => {
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
            <TremorPieChart 
              data={chartData}
              index="name"
              category="value"
              colors={["purple", "gray"]}
            />
          )}
          {kpi.chartType === "donut" && (
            <TremorDonutChart 
              data={chartData}
              index="name"
              category="value"
              colors={["purple", "gray"]}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomKpiCard;
