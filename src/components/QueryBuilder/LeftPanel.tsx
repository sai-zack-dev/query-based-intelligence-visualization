import React, { useState } from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { SidebarData } from "@/types/sidebar";
import { FiDatabase, FiBookmark } from "react-icons/fi";
import { RiInformation2Line, RiInformation2Fill } from "react-icons/ri";
import { FaBookmark, FaDatabase } from "react-icons/fa";
import SidebarTab from "@/components/common/SidebarTab";
import DataExplorer from "./sidebar/DataExplorer";
import { ConnectionData, ConnectionType } from "@/types/connection";
import SavedQuery from "./sidebar/SavedQuery";
import DataSource from "./sidebar/DataSource";

const sidebarTabs = [
  {
    id: "data_exp",
    icon: FiDatabase,
    activeIcon: FaDatabase,
  },
  {
    id: "saved_query",
    icon: FiBookmark,
    activeIcon: FaBookmark,
  },
  {
    id: "data_source",
    icon: RiInformation2Line,
    activeIcon: RiInformation2Fill,
  },
];

export const LeftPanel: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  const [sidebarTab, setSidebarTab] = useState<
    "data_exp" | "saved_query" | "data_source"
  >("data_exp");

  const sidebarClasses = `
    sidebar
    ${
      sidebarActive
        ? "translate-x-0 min-w-[300px] w-[300px] lg:min-w-[350px] xl:min-w-[400px]"
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

  return (
    <>
      {/* Sidebar Panel */}
      <div className={sidebarClasses}>
        {/* Sidebar Content */}
        {sidebarActive && (
          <>
            {sidebarTab === "data_exp" && <DataExplorer />}
            {sidebarTab === "saved_query" && <SavedQuery />}
            {sidebarTab === "data_source" && <DataSource />}
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
            isActive={sidebarTab === tab.id}
            onSelect={(tabId: string) =>
              setSidebarTab(tabId as "data_exp" | "saved_query" | "data_source")
            }
            isDisabled={false}
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
