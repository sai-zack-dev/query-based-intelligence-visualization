export type ChartName =
  | "TinyBar"
  | "SimpleBar"
  | "StackedBar"
  | "DashedLine"
  | "VerticalLine"
  | "DonutPie"
  | "StraightAnglePie"
  | "SimplePie"
  | "SimpleLine"
  | "SimpleArea"
  | "StackedArea"
  | "TargetedLineArea"
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
  // shared chart settings
  data?: any[];
  xKey?: string;
  xAxis?: boolean;
  yKey?: string;
  yAxis?: boolean;
  tooltip?: boolean;
  legend?: boolean;
  strokeDasharray?: string;

  // Bar chart settings
  barsKey?: string;
  bars?: BarConfig[];

  // Line chart settings
  lines?: LineConfig[];

  // Area chart settings
  stackOffset?: "none" | "expand" | "wiggle" | "silhouette";
  customDefs?: LinearGradient[];
  areas?: AreaConfig[];

  // Pie chart settings
  pies?: PieConfig[];
}
export interface AreaConfig {
  dataKey: string;
  stroke?: string;
  fill?: string;
  active?: boolean;
  stackId?: string;
  type?: "monotone" | "linear" | "step" | "basis" | "natural";
}
export interface LinearGradient {
  offset: string;
  color: string;
  opacity: number;
}
export interface BarConfig {
  dataKey: string;
  fill: string;
  active?: boolean;
  stackId?: string;
}
export interface LineConfig {
  dataKey: string;
  stroke?: string;
  strokeDasharray?: string;
  activeDot?: { r: number };
  active?: boolean;
  type?: "monotone" | "linear" | "step" | "basis" | "natural";
}
export interface PieConfig {
  dataIdx: number;
  dataKey: string;
  cx?: number | string;
  cy?: number | string;
  outerRadius?: number;
  innerRadius?: number;
  fills?: string[];
  label?: boolean;
  startAngle?: number;
  endAngle?: number;
}
