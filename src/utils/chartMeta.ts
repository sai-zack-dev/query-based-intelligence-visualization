import { IconType } from "react-icons";
import { IoBarChart, IoPieChart } from "react-icons/io5";
import { ChartName, PieConfig, ChartTemplateProps } from "@/types/chart";

// === Type Definitions ===
export type ChartTypeMeta = {
  id: ChartName;
  title: string;
  category: ChartCategoryId;
  demoData: any[];
  demoConfig: Partial<ChartTemplateProps>;
};

export type ChartCategoryMeta = {
  categoryId: ChartCategoryId;
  categoryTitle: string;
  categoryIcon: IconType;
};

export type ChartCategoryId = "bar" | "line" | "area" | "composed" | "pie";

// === Chart Categories ===
export const chartCategories: ChartCategoryMeta[] = [
  {
    categoryId: "bar",
    categoryTitle: "Bar Chart",
    categoryIcon: IoBarChart,
  },
  {
    categoryId: "pie",
    categoryTitle: "Pie Chart",
    categoryIcon: IoPieChart,
  },
];

// === Chart Metadata ===
export const chartMeta: ChartTypeMeta[] = [
  {
    id: "TinyBar",
    title: "Tiny Bar",
    category: "bar",
    demoData: genDemoData(),
    demoConfig: {
      tooltip: true,
      yAxis: true,
      bars: [{ dataKey: "uv", fill: "#8884d8", active: true }],
    },
  },
  {
    id: "SimpleBar",
    title: "Simple Bar",
    category: "bar",
    demoData: genDemoData(),
    demoConfig: {
      xKey: "name",
      xAxis: true,
      legend: true,
      bars: [
        { dataKey: "pv", fill: "#8884d8", active: true },
        { dataKey: "uv", fill: "#82ca9d", active: true },
      ],
    },
  },
  {
    id: "StackedBar",
    title: "Stacked Bar",
    category: "bar",
    demoData: genDemoData(),
    demoConfig: {
      xKey: "name",
      xAxis: true,
      yAxis: true,
      tooltip: true,
      bars: [
        { dataKey: "uv", fill: "#8884d8", active: true, stackId: "a" },
        { dataKey: "pv", fill: "#82ca9d", active: true, stackId: "a" },
      ],
    },
  },

  // === Pie Charts ===
  {
    id: "TwoLevelPie",
    title: "Two Level Pie",
    category: "pie",
    demoData: [genPieDemoData(4, "Group"), genPieDemoData(6, "A")],
    demoConfig: {
      tooltip: true,
      pies: [
        {
          dataIdx: 0,
          dataKey: "value",
          cx: "50%",
          cy: "50%",
          outerRadius: 60,
          fill: "#8884d8",
        },
        {
          dataIdx: 1,
          dataKey: "value",
          cx: "50%",
          cy: "50%",
          outerRadius: 90,
          innerRadius: 70,
          fill: "#82ca9d",
          label: true,
        },
      ],
    },
  },
  {
    id: "StraightAnglePie",
    title: "Straight Angle Pie",
    category: "pie",
    demoData: [genPieDemoData(6, "Group")],
    demoConfig: {
      pies: [
        {
          dataIdx: 0,
          dataKey: "value",
          startAngle: 180,
          endAngle: 0,
          cx: "50%",
          cy: "50%",
          outerRadius: 80,
          fill: "#8884d8",
          label: true,
        },
      ],
    },
  },
  {
    id: "TwoSimplePie",
    title: "Two Simple Pies",
    category: "pie",
    demoData: [genPieDemoData(6, "Group"), genPieDemoData(6, "Group")],
    demoConfig: {
      pies: [
        {
          dataIdx: 0,
          dataKey: "value",
          cx: "50%",
          cy: "50%",
          outerRadius: 80,
          fill: "#8884d8",
          label: true,
          startAngle: 180,
          endAngle: 0,
        },
        {
          dataIdx: 1,
          dataKey: "value",
          cx: "50%",
          cy: "50%",
          outerRadius: 80,
          fill: "#82ca9d",
          label: true,
          startAngle: 360,
          endAngle: 180,
        },
      ],
    },
  },
];

// === Demo data generator for bar/line/area
function genDemoData() {
  return Array.from({ length: 6 }, (_, i) => ({
    name: `P${i + 1}`,
    uv: Math.floor(Math.random() * 400 + 100),
    pv: Math.floor(Math.random() * 400 + 100),
    amt: Math.floor(Math.random() * 400 + 100),
  }));
}

function genPieDemoData(count: number, groupPrefix: string) {
  return Array.from({ length: count }, (_, i) => ({
    name: `${groupPrefix}${i + 1}`,
    value: Math.floor(Math.random() * 500 + 100),
  }));
}
