import ChartCategories from "./sidebar/ChartCategories";
import ChartSetting from "./sidebar/ChartSetting";
import { SidebarData } from "@/types/sidebar";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import SidebarTab from "../common/SidebarTab";
import {
  IoPieChart,
  IoPieChartOutline,
  IoSettingsOutline,
  IoSettingsSharp,
} from "react-icons/io5";
import { useChart } from "@/context/ChartContext";

const SidePanel = ({ sidebarActive, toggleSidebar }: SidebarData) => {
  const { activeTab, setActiveTab, chartType } = useChart();
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
  ];
  const sidebarClasses = `
    sidebar
    ${
      sidebarActive
        ? "translate-x-0 min-w-[300px] w-[300px] lg:w-[350px] xl:w-[400px]"
        : "-translate-x-full w-0 overflow-hidden"
    }
  `.trim();

  const toggleButtonClasses = `
    sidebar-toggle
    ${
      sidebarActive
        ? `translate-x-[250px] lg:translate-x-[300px] xl:translate-x-[350px]`
        : "shadow translate-x-0 bg-white"
    }
  `.trim();

  const isDisabled = chartType === null;

  return (
    <>
      {/* Sidebar Panel */}
      <div className={sidebarClasses}>
        {/* Sidebar Content */}
        {sidebarActive && (
          <>
            {activeTab === "type" && <ChartCategories />}
            {activeTab === "config" && <ChartSetting />}
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
            isDisabled={isDisabled}
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
