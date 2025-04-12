
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Plus } from "lucide-react";
import CustomKpiCard from "./CustomKpiCard";
import { KpiData } from "@/types/metrics";

interface CustomKpisListProps {
  customKpis: KpiData[];
  onAddKpi: () => void;
  onEditKpi: (kpi: KpiData) => void;
  onDeleteKpi: (id: number) => void;
  showAddKpi: boolean;
}

const CustomKpisList: React.FC<CustomKpisListProps> = ({
  customKpis,
  onAddKpi,
  onEditKpi,
  onDeleteKpi,
  showAddKpi
}) => {
  return (
    <div className="space-y-6">
      {!showAddKpi && (
        <div className="flex justify-end">
          <Button onClick={onAddKpi}>
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
            onEdit={onEditKpi} 
            onDelete={onDeleteKpi} 
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
              <Button onClick={onAddKpi}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First KPI
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomKpisList;
