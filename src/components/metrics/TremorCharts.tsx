
import React from "react";
import { DonutChart as TremDonutChart, LineChart, BarChart } from "@tremor/react";

// We need to create a wrapper for the PieChart since it doesn't exist in @tremor/react
// Instead, we'll use the DonutChart with special props to make it look like a pie chart
interface ChartProps {
  data: { name: string; value: number }[];
  index: string;
  category: string;
  colors: string[];
  showLabel?: boolean;
  showAnimation?: boolean;
}

export const TremorPieChart: React.FC<ChartProps> = ({
  data,
  index,
  category,
  colors,
  showLabel = false,
  showAnimation = true
}) => {
  return (
    <TremDonutChart 
      data={data}
      index={index}
      category={category}
      colors={colors}
      showLabel={showLabel}
      showAnimation={showAnimation}
      variant="pie" // Use variant pie for pie chart look
    />
  );
};

export const TremorDonutChart: React.FC<ChartProps> = ({
  data,
  index,
  category,
  colors,
  showLabel = false,
  showAnimation = true
}) => {
  return (
    <TremDonutChart 
      data={data}
      index={index}
      category={category}
      colors={colors}
      showLabel={showLabel}
      showAnimation={showAnimation}
    />
  );
};

// Export other charts if needed for consistency
export { LineChart, BarChart };
