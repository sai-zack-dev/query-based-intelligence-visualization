// ChartGenerationPage.tsx
import { useState } from "react";
import SidePanel from "@/components/Chart/SidePanel";
import MainContent from "@/components/Chart/MainContent";
import { SidebarData } from "@/types/sidebar";

export type ChartTab = "type" | "config" | "info";

const ChartGenerationPage: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>("type");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("basic");
  const [chartType, setChartType] = useState<string>("");

  return (
    <>
      <SidePanel
        sidebarActive={sidebarActive}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
        chartType={chartType}
      />
      <MainContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setActiveCategoryId={setActiveCategoryId}
        chartType={chartType}
        setChartType={setChartType}
      />
    </>
  );
};

export default ChartGenerationPage;
