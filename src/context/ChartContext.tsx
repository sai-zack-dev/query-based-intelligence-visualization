import { ChartName } from "@/data/chartMeta";
import { createContext, useContext, useState, ReactNode } from "react";

export type ChartTab = "type" | "config" | "info";

export interface LineConfig {
  dataKey: string;
  stroke: string;
  active: boolean;
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

  resultData: any[];
  setResultData: (data: any[]) => void;

  xKey: string;
  setXKey: (key: string) => void;
  yKey: string;
  setYKey: (key: string) => void;

  seriesKey: string;
  setSeriesKey: (key: string) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState<ChartTab>("type");
  const [activeCategoryId, setActiveCategoryId] = useState("basic");
  const [chartType, setChartType] = useState<ChartName>(null);

  const [resultData, setResultData] = useState<any[]>([]);
  const [lines, setLines] = useState<LineConfig[]>([]);

  const [xKey, setXKey] = useState<string>("Day_Month");
  const [yKey, setYKey] = useState<string>("Revenue");

  const [seriesKey, setSeriesKey] = useState<string>("Room_Type");

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
        resultData,
        setResultData,
        xKey,
        setXKey,
        yKey,
        setYKey,
        seriesKey,
        setSeriesKey,
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
