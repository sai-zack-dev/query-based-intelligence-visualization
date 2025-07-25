import { ChartName } from "@/data/chartMeta";
import { createContext, useContext, useState, ReactNode } from "react";

export type ChartTab = "type" | "config" | "info";

export interface LineConfig {
  dataKey: string;
  stroke: string;
}

interface ChartContextType {
  activeTab: ChartTab;
  setActiveTab: (tab: ChartTab) => void;
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  chartType: ChartName;
  setChartType: (type: ChartName) => void;
  lines: LineConfig[];
  setLines: (lines: LineConfig[]) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>("type");
  const [activeCategoryId, setActiveCategoryId] = useState("basic");
  const [chartType, setChartType] = useState<ChartName>(null);

  const [lines, setLines] = useState<LineConfig[]>([
    { dataKey: "pv", stroke: "#8884d8" },
    { dataKey: "uv", stroke: "#82ca9d" },
  ]);

  return (
    <ChartContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeCategoryId,
        setActiveCategoryId,
        chartType,
        setChartType,
        lines,
        setLines,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export const useChart = () => {
  const context = useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within ChartProvider");
  return context;
};
