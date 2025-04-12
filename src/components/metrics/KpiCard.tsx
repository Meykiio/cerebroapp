
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType, icon: Icon }) => {
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

export default KpiCard;
