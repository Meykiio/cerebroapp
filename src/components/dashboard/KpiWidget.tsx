
import { ArrowUpRight, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { generateMetricInsight } from "@/services/geminiService";
import { Link } from "react-router-dom";
import WidgetWrapper from "./WidgetWrapper";

const kpiData = {
  revenue: [
    { month: 'Jan', value: 12000 },
    { month: 'Feb', value: 15000 },
    { month: 'Mar', value: 18000 },
    { month: 'Apr', value: 17000 },
    { month: 'May', value: 21000 },
    { month: 'Jun', value: 25000 },
  ]
};

const KpiWidget = () => {
  const latestRevenue = kpiData.revenue[kpiData.revenue.length - 1].value;
  const previousRevenue = kpiData.revenue[kpiData.revenue.length - 2].value;
  const percentChange = ((latestRevenue - previousRevenue) / previousRevenue) * 100;

  // Get AI insight for revenue
  const { data: insight, isLoading: insightLoading } = useQuery({
    queryKey: ['revenue-insight'],
    queryFn: () => generateMetricInsight('revenue', kpiData.revenue),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return (
    <WidgetWrapper title="Revenue" icon={<BarChart3 className="h-5 w-5 text-green-400" />}>
      <Link to="/metrics" className="block">
        <Card className="bg-gray-800/30 border-white/5 p-3 hover:bg-white/5 transition-colors cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-cerebro-soft/70">Monthly Revenue</p>
              <p className="text-2xl font-bold">${latestRevenue.toLocaleString()}</p>
              <div className={`flex items-center mt-1 ${percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <p className="text-xs">{percentChange.toFixed(1)}% vs last month</p>
              </div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="text-xs text-cerebro-soft/70 mb-2">Last 6 months</div>
            <div className="flex items-end justify-between h-12">
              {kpiData.revenue.map((data, i) => (
                <div 
                  key={data.month} 
                  className="w-1/6 bg-cerebro-purple"
                  style={{ 
                    height: `${(data.value / 25000) * 100}%`,
                    opacity: 0.3 + ((i / kpiData.revenue.length) * 0.7)
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {kpiData.revenue.map((data) => (
                <div key={data.month} className="text-[10px] text-cerebro-soft/50">
                  {data.month}
                </div>
              ))}
            </div>
          </div>

          {insight && (
            <div className="mt-3 text-xs p-2 bg-cerebro-purple/10 rounded text-cerebro-soft/90 border border-cerebro-purple/20">
              {insightLoading ? "Analyzing data..." : insight}
            </div>
          )}
        </Card>
      </Link>
    </WidgetWrapper>
  );
};

export default KpiWidget;
