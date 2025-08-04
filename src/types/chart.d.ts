export type ChartName =
  | "TinyBar"
  | "SimpleBar"
  | "StackedBar"
  | "TwoLevelPie"
  | "StraightAnglePie"
  | "TwoSimplePie"
  | null;

export interface DashboardChart {
  id: number;
  uuid: string;
  title: string;
  type: ChartName;
  config: string;
  data: string;   
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChartTemplateProps {
  // Bar chart settings
  data?: any[];
  xKey?: string;
  xAxis?: boolean;
  yKey?: string;
  yAxis?: boolean;
  tooltip?: boolean;
  legend?: boolean;
  barsKey?: string;
  bars?: BarConfig[];
  strokeDasharray?: string;

  // Pie chart settings
  pies?: PieConfig[];
}

export interface BarConfig {
  dataKey: string;
  fill: string;
  active?: boolean;
  stackId?: string;
}

export interface PieConfig {
  dataIdx: number;
  dataKey: string;
  cx?: number | string;
  cy?: number | string;
  outerRadius?: number;
  innerRadius?: number;
  fill?: string;
  label?: boolean;
  startAngle?: number;
  endAngle?: number;
}
