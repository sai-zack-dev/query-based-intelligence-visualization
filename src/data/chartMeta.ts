// src/data/chartMeta.ts
import { PercentAreaChart, SimpleAreaChart } from "@/components/Chart/list/AreaChart";
import { StackedBarChart, TinyBarChart } from "@/components/Chart/list/BarChart";
import { LineBarAreaComposedChart } from "@/components/Chart/list/ComposedChart";
import { BiaxialLineChart, DashedLineChart, SimpleLineChart } from "@/components/Chart/list/LineChart";
import { IconType } from "react-icons";

// Define chart meta types
export type ChartTypeMeta = {
  id: string;
  name: string;
  Component: React.FC;
};

export type ChartCategoryMeta = {
  categoryId: string;
  categoryTitle: string;
  categoryIcon: IconType | string; // For sidebar icon (e.g., "LineChartIcon")
  charts: ChartTypeMeta[];
};

// Icon imports (you can adjust to match the icon lib you're using)
import { IoGitNetwork, IoBarChart, IoLayers, IoTrendingUp } from "react-icons/io5";

export const chartMeta: ChartCategoryMeta[] = [
  {
    categoryId: "line",
    categoryTitle: "Line Chart",
    categoryIcon: IoTrendingUp,
    charts: [
      { id: "simple-line", name: "Simple Line", Component: SimpleLineChart },
      { id: "dashed-line", name: "Dashed Line", Component: DashedLineChart },
      { id: "biaxial-line", name: "Biaxial Line", Component: BiaxialLineChart },
      // { id: "connect-nulls", name: "Connect Nulls", Component: LineChartConnectNulls },
    ],
  },
  {
    categoryId: "area",
    categoryTitle: "Area Chart",
    categoryIcon: IoGitNetwork,
    charts: [
      { id: "simple-area", name: "Simple Area", Component: SimpleAreaChart },
      // { id: "connect-nulls", name: "Connect Nulls", Component: AreaChartConnectNulls },
      { id: "percent-area", name: "Percent Area", Component: PercentAreaChart },
    ],
  },
  {
    categoryId: "bar",
    categoryTitle: "Bar Chart",
    categoryIcon: IoBarChart,
    charts: [
      { id: "tiny-bar", name: "Tiny Bar", Component: TinyBarChart },
      { id: "stacked-bar", name: "Stacked Bar", Component: StackedBarChart },
    ],
  },
  {
    categoryId: "composed",
    categoryTitle: "Composed Chart",
    categoryIcon: IoLayers,
    charts: [
      { id: "line-bar-area", name: "Line-Bar-Area", Component: LineBarAreaComposedChart },
    ],
  },
];
