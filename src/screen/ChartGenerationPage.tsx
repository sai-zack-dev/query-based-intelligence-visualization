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

  return (
    <>
      <SidePanel
        sidebarActive={sidebarActive}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
      />
      <MainContent
        activeTab={activeTab}
        setActiveCategoryId={setActiveCategoryId}
      />
    </>
  );
};

export default ChartGenerationPage;
