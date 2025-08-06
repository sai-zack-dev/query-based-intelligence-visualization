import { IconType } from "react-icons";
import { IoBarChart, IoPieChart } from "react-icons/io5";
import { ChartName, PieConfig, ChartTemplateProps } from "@/types/chart";
import { LuChartLine } from "react-icons/lu";
import { AiOutlineAreaChart } from "react-icons/ai";

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
    categoryId: "line",
    categoryTitle: "Line Chart",
    categoryIcon: LuChartLine,
  },
  {
    categoryId: "area",
    categoryTitle: "Area Chart",
    categoryIcon: AiOutlineAreaChart,
  },
  {
    categoryId: "pie",
    categoryTitle: "Pie Chart",
    categoryIcon: IoPieChart,
  },
];

// === Chart Metadata ===
export const chartMeta: ChartTypeMeta[] = [
  // === Bar Charts ===
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

  // === Area Charts ===
  {
    id: "SimpleArea",
    title: "Simple Area",
    category: "area",
    demoData: genDemoData(),
    demoConfig: {
      xKey: "name",
      xAxis: true,
      yAxis: true,
      tooltip: true,
      legend: false,
      areas: [
        {
          dataKey: "uv",
          stroke: "#8884d8",
          fill: "#8884d8",
          active: true,
          type: "monotone",
        },
      ],
    },
  },
  {
    id: "StackedArea",
    title: "Stacked Area",
    category: "area",
    demoData: genDemoData(),
    demoConfig: {
      xKey: "name",
      xAxis: true,
      yAxis: true,
      tooltip: true,
      legend: false,
      stackOffset: "expand",
      areas: [
        {
          dataKey: "uv",
          stroke: "#8884d8",
          fill: "#8884d8",
          active: true,
          stackId: "1",
          type: "monotone",
        },
        {
          dataKey: "pv",
          stroke: "#82ca9d",
          fill: "#82ca9d",
          active: true,
          stackId: "1",
          type: "monotone",
        },
        {
          dataKey: "amt",
          stroke: "#ffc658",
          fill: "#ffc658",
          active: true,
          stackId: "1",
          type: "monotone",
        },
      ],
    },
  },
  {
    id: "TargetedLineArea",
    title: "Targeted Line Area",
    category: "area",
    demoData: genDemoData(),
    demoConfig: {
      xKey: "name",
      xAxis: true,
      yAxis: true,
      tooltip: true,
      legend: false,
      areas: [
        {
          dataKey: "uv",
          stroke: "#000000",
          fill: "url(#splitColor)",
          active: true,
          type: "monotone",
        },
      ],
      customDefs: [
        {
          offset: "50%",
          color: "#82ca9d",
          opacity: 1,
        },
        {
          offset: "50%",
          color: "#ffc658",
          opacity: 1,
        },
      ],
    },
  },

  // === Line Charts ===
  {
    id: "SimpleLine",
    title: "Simple Line",
    category: "line",
    demoData: genDemoData(),
    demoConfig: {
      xKey: "name",
      xAxis: true,
      yAxis: true,
      tooltip: true,
      legend: true,
      lines: [
        {
          dataKey: "pv",
          stroke: "#8884d8",
          activeDot: { r: 8 },
          active: true,
          type: "monotone",
        },
        {
          dataKey: "uv",
          stroke: "#82ca9d",
          active: true,
          type: "monotone",
        },
      ],
    },
  },
  {
    id: "DashedLine",
    title: "Dashed Line",
    category: "line",
    demoData: genDemoData(),
    demoConfig: {
      xKey: "name",
      xAxis: true,
      yAxis: true,
      tooltip: true,
      legend: true,
      lines: [
        {
          dataKey: "pv",
          stroke: "#8884d8",
          strokeDasharray: "5 5",
          active: true,
          type: "monotone",
        },
        {
          dataKey: "uv",
          stroke: "#82ca9d",
          strokeDasharray: "3 4 5 2",
          active: true,
          type: "monotone",
        },
      ],
    },
  },
  {
    id: "VerticalLine",
    title: "Vertical Line",
    category: "line",
    demoData: genDemoData(),
    demoConfig: {
      xKey: "pv", // X-axis becomes numerical value
      xAxis: true,
      yAxis: true,
      tooltip: true,
      legend: true,
      lines: [
        {
          dataKey: "pv",
          stroke: "#8884d8",
          active: true,
          type: "monotone",
        },
        {
          dataKey: "uv",
          stroke: "#82ca9d",
          active: true,
          type: "monotone",
        },
      ],
    },
  },

  // === Pie Charts ===
  {
    id: "DonutPie",
    title: "Donut Pie",
    category: "pie",
    demoData: [genPieDemoData(4, "Group")],
    demoConfig: {
      tooltip: true,
      pies: [
        {
          dataIdx: 0,
          dataKey: "value",
          cx: "50%",
          cy: "50%",
          outerRadius: 90,
          innerRadius: 50,
          fills: [
            "#8884d8",
            "#0088FE",
            "#00C49F",
            "#FFBB28",
            "#FF8042",
            "#82ca9d",
          ],
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
          fills: [
            "#8884d8",
            "#0088FE",
            "#00C49F",
            "#FFBB28",
            "#FF8042",
            "#82ca9d",
          ],
          label: true,
        },
      ],
    },
  },
  {
    id: "SimplePie",
    title: "Simple Pies",
    category: "pie",
    demoData: [genPieDemoData(6, "Group")],
    demoConfig: {
      tooltip: true,
      pies: [
        {
          dataIdx: 0,
          dataKey: "value",
          cx: "50%",
          cy: "50%",
          outerRadius: 80,
          fills: [
            "#8884d8",
            "#0088FE",
            "#00C49F",
            "#FFBB28",
            "#FF8042",
            "#82ca9d",
          ],
          label: true,
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
