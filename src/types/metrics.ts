
export type ChartType = "line" | "bar" | "pie" | "donut";

export interface KpiData {
  id: number;
  name: string;
  target: number;
  current: number;
  unit: string;
  chartType: ChartType;
  progress: number;
  lastUpdated: string;
}

// Sample data types for charts
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface MultiSeriesDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
}
