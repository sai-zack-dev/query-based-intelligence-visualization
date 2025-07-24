import { ChartTab } from "@/screen/ChartGenerationPage";
import ChartCategories from "./sidebar/ChartCategories";
import ChartSetting from "./sidebar/ChartSetting";
import QuerySource from "./sidebar/QuerySource";
import { SidebarData } from "@/types/sidebar";
import {
  RiInformation2Fill,
  RiInformation2Line,
  RiSidebarFoldLine,
  RiSidebarUnfoldLine,
} from "react-icons/ri";
import { FiBookmark, FiDatabase } from "react-icons/fi";
import { FaBookmark, FaDatabase } from "react-icons/fa";
import { useState } from "react";
import SidebarTab from "../common/SidebarTab";
import {
  IoPieChart,
  IoPieChartOutline,
  IoSettingsOutline,
  IoSettingsSharp,
} from "react-icons/io5";

interface Prop extends SidebarData {
  activeTab: ChartTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ChartTab>>;
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
}

const SidePanel: React.FC<Prop> = ({
  sidebarActive,
  toggleSidebar,
  activeTab,
  setActiveTab,
  activeCategoryId,
  setActiveCategoryId,
}) => {
  const sidebarTabs = [
    {
      id: "type",
      icon: IoPieChartOutline,
      activeIcon: IoPieChart,
    },
    {
      id: "config",
      icon: IoSettingsOutline,
      activeIcon: IoSettingsSharp,
    },
    // {
    //   id: "info",
    //   icon: RiInformation2Line,
    //   activeIcon: RiInformation2Fill,
    // },
  ];
  const sidebarClasses = `
    sidebar
    ${
      sidebarActive
        ? "translate-x-0 min-w-[300px] w-[300px] lg:w-[400px] xl:w-[500px]"
        : "-translate-x-full w-0 overflow-hidden"
    }
  `.trim();

  const toggleButtonClasses = `
    sidebar-toggle
    ${
      sidebarActive
        ? `translate-x-[250px] lg:translate-x-[350px] xl:translate-x-[450px]`
        : "shadow translate-x-0"
    }
  `.trim();

  return (
    <>
      {/* Sidebar Panel */}
      <div className={sidebarClasses}>
        {/* Sidebar Content */}
        {sidebarActive && (
          <>
            {activeTab === "type" && (
              <ChartCategories
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={setActiveCategoryId}
              />
            )}
            {activeTab === "config" && <ChartSetting />}
            {/* {activeTab === "info" && <QuerySource />} */}
          </>
        )}
      </div>

      {/* Sidebar Tabs */}
      <div
        className={`absolute flex flex-col left-0 top-40 bg-white rounded-e-xl transition-shadow duration-200 ${
          !sidebarActive ? "shadow-lg" : ""
        }`}
        role="tablist"
        aria-label="Sidebar navigation"
      >
        {sidebarTabs.map((tab) => (
          <SidebarTab
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onSelect={(tabId: string) =>
              setActiveTab(tabId as "type" | "config" | "info")
            }
          />
        ))}
      </div>

      {/* Toggle Button */}
      <button
        className={toggleButtonClasses}
        onClick={toggleSidebar}
        type="button"
        aria-label={sidebarActive ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarActive ? (
          <RiSidebarFoldLine size={16} />
        ) : (
          <RiSidebarUnfoldLine size={16} />
        )}
      </button>
    </>
  );
};

export default SidePanel;
