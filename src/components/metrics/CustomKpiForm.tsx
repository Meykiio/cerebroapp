
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LineChartIcon, BarChart3, PieChart as PieChartIcon, Donut } from "lucide-react";
import { KpiData } from "@/types/metrics";

interface CustomKpiFormProps {
  onSave: (kpiData: KpiData) => void;
  onCancel: () => void;
  initialData?: KpiData | null;
}

const CustomKpiForm: React.FC<CustomKpiFormProps> = ({ onSave, onCancel, initialData = null }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [target, setTarget] = useState(initialData?.target?.toString() || "");
  const [current, setCurrent] = useState(initialData?.current?.toString() || "");
  const [unit, setUnit] = useState(initialData?.unit || "");
  const [chartType, setChartType] = useState(initialData?.chartType || "line");

  const handleSubmit = (e: React.FormEvent) => {
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
            <Donut className="h-4 w-4 mr-2" />
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

export default CustomKpiForm;
