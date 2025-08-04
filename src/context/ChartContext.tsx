import { ChartName, ChartTemplateProps } from "@/types/chart";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { transformChartData } from "@/utils/transformChartData";
import { useEffect } from "react";

export type ChartTab = "type" | "config" | "info";

export interface LineConfig {
  dataKey: string;
  color: string;
  active: boolean;
}

interface ChartContextType {
  activeTab: ChartTab;
  setActiveTab: (tab: ChartTab) => void;
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  chartType: ChartName;
  setChartType: (type: ChartName) => void;
  chartData: any[];
  setChartData: (data: any[]) => void;
  chartConfig: ChartTemplateProps | undefined;
  setChartConfig: React.Dispatch<
    React.SetStateAction<ChartTemplateProps | undefined>
  >;
  resultData: any[];
  chartTitle: string;
  setChartTitle: (title: string) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export const ChartProvider = ({
  children,
  resultData = [],
}: {
  children: ReactNode;
  resultData?: any[];
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>("type");
  const [activeCategoryId, setActiveCategoryId] = useState("basic");
  const [chartType, setChartType] = useState<ChartName>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartConfig, setChartConfig] = useState<ChartTemplateProps>();
  const [chartTitle, setChartTitle] = useState("Untitled Chart");

  useEffect(() => {
    const data = transformChartData(chartType, chartConfig, resultData);
    // console.log(data)
    setChartData(data);
  }, [chartType, chartConfig, resultData]);

  return (
    <ChartContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeCategoryId,
        setActiveCategoryId,
        chartType,
        setChartType,
        chartData,
        setChartData,
        chartConfig,
        setChartConfig,
        resultData,
        chartTitle,
        setChartTitle
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
