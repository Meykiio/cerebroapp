
import { 
  ChartDataPoint, 
  MultiSeriesDataPoint, 
  PieChartDataPoint 
} from "@/types/metrics";

// Sample data for charts
export const sampleRevenueData: ChartDataPoint[] = [
  { date: "Jan", value: 2400 },
  { date: "Feb", value: 1398 },
  { date: "Mar", value: 9800 },
  { date: "Apr", value: 3908 },
  { date: "May", value: 4800 },
  { date: "Jun", value: 3800 },
  { date: "Jul", value: 4300 },
];

export const sampleExpensesData: ChartDataPoint[] = [
  { date: "Jan", value: 1400 },
  { date: "Feb", value: 1100 },
  { date: "Mar", value: 5800 },
  { date: "Apr", value: 2908 },
  { date: "May", value: 2800 },
  { date: "Jun", value: 2100 },
  { date: "Jul", value: 2300 },
];

export const sampleProfitData: ChartDataPoint[] = [
  { date: "Jan", value: 1000 },
  { date: "Feb", value: 298 },
  { date: "Mar", value: 4000 },
  { date: "Apr", value: 1000 },
  { date: "May", value: 2000 },
  { date: "Jun", value: 1700 },
  { date: "Jul", value: 2000 },
];

export const sampleCustomerData: ChartDataPoint[] = [
  { date: "Jan", value: 40 },
  { date: "Feb", value: 43 },
  { date: "Mar", value: 45 },
  { date: "Apr", value: 52 },
  { date: "May", value: 58 },
  { date: "Jun", value: 62 },
  { date: "Jul", value: 70 },
];

export const sampleConversionData: ChartDataPoint[] = [
  { date: "Jan", value: 2.4 },
  { date: "Feb", value: 2.8 },
  { date: "Mar", value: 3.2 },
  { date: "Apr", value: 3.1 },
  { date: "May", value: 3.8 },
  { date: "Jun", value: 4.2 },
  { date: "Jul", value: 4.5 },
];

export const sampleChannelData: PieChartDataPoint[] = [
  { name: "Organic Search", value: 35 },
  { name: "Direct", value: 25 },
  { name: "Social Media", value: 20 },
  { name: "Email", value: 15 },
  { name: "Referral", value: 5 },
];

export const sampleProductData: PieChartDataPoint[] = [
  { name: "Product A", value: 40 },
  { name: "Product B", value: 30 },
  { name: "Product C", value: 20 },
  { name: "Product D", value: 10 },
];

// Helper function to combine data for multi-series charts
export const combineChartData = (): MultiSeriesDataPoint[] => {
  return sampleRevenueData.map((item, i) => ({
    date: item.date,
    Revenue: item.value,
    Expenses: sampleExpensesData[i].value,
    Profit: sampleProfitData[i].value
  }));
};

export const combineCustomerData = (): MultiSeriesDataPoint[] => {
  return sampleCustomerData.map((item, i) => ({
    date: item.date,
    "New Customers": item.value,
    "Conversion Rate (%)": sampleConversionData[i].value
  }));
};
