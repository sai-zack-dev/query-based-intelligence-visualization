// src/data/chartMeta.ts
import { StackedBarChart, SimpleBarChart, TinyBarChart } from "@/components/Chart/list/BarChart";
import { IconType } from "react-icons";

export type ChartName = "TinyBar" | "SimpleBar" | "StackedBar" | null;

// Define chart meta types
export type ChartTypeMeta = {
  id: ChartName;
  title: string;
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
  // {
  //   categoryId: "line",
  //   categoryTitle: "Line Chart",
  //   categoryIcon: IoTrendingUp,
  //   charts: [
  //     { id: "SimpleLineChart", title: "Simple Line", Component: SimpleLineChart },
  //     { id: "DashedLineChart", title: "Dashed Line", Component: DashedLineChart },
  //     { id: "BiaxialLineChart", title: "Biaxial Line", Component: BiaxialLineChart },
  //   ],
  // },
  // {
  //   categoryId: "area",
  //   categoryTitle: "Area Chart",
  //   categoryIcon: IoGitNetwork,
  //   charts: [
  //     { id: "SimpleArea", title: "Simple Area", Component: SimpleAreaChart },
  //     { id: "PercentArea", title: "Percent Area", Component: PercentAreaChart },
  //   ],
  // },
  {
    categoryId: "bar",
    categoryTitle: "Bar Chart",
    categoryIcon: IoBarChart,
    charts: [
      { id: "TinyBar", title: "Tiny Bar", Component: TinyBarChart },
      { id: "SimpleBar", title: "Simple Bar", Component: SimpleBarChart },
      { id: "StackedBar", title: "Stacked Bar", Component: StackedBarChart },
    ],
  },
  // {
  //   categoryId: "composed",
  //   categoryTitle: "Composed Chart",
  //   categoryIcon: IoLayers,
  //   charts: [
  //     { id: "LineBarArea", title: "Line-Bar-Area", Component: LineBarAreaComposedChart },
  //   ],
  // },
];
