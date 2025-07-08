import React, { useState } from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { SidebarData } from "../../types/sidebar";
import { FiDatabase, FiBookmark } from "react-icons/fi";
import { RiInformation2Line, RiInformation2Fill } from "react-icons/ri";
import { FaBookmark, FaDatabase } from "react-icons/fa";
import SidebarTab from "../common/SidebarTab";
import DataExplorer from "./sidebar/DataExplorer";
import SavedQuery from "./sidebar/SavedQuery";
import DataSource from "./sidebar/DataSource";
import { ConnectionData } from '@/types/connection';

const SIDEBAR_TABS = [
  {
    id: "data_exp",
    icon: FiDatabase,
    activeIcon: FaDatabase,
    label: "Data Explorer",
  },
  {
    id: "saved_query",
    icon: FiBookmark,
    activeIcon: FaBookmark,
    label: "Saved Queries",
  },
  {
    id: "data_source",
    icon: RiInformation2Line,
    activeIcon: RiInformation2Fill,
    label: "Data Source",
  },
];
  const currentConnection: ConnectionData = {
    id: "mock-1",
    name: "MySQL Database",
    type: "MySQL",
    host: "localhost",
    port: 3306,
    file: null,
    date: "06/07/2025"
  };

export const LeftPanel: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
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
    ${sidebarActive ? `translate-x-[250px] lg:translate-x-[350px] xl:translate-x-[450px]` : "shadow translate-x-0"}
  `.trim();

  const [sidebarTab, setSidebarTab] = useState<
    "data_exp" | "saved_query" | "data_source"
  >("data_exp");

  return (
    <>
      {/* Sidebar Panel */}
      <div className={sidebarClasses}>
        {/* Header */}
        {sidebarActive && (
          <>
            {/* Sidebar Content */}
            {sidebarTab === "data_exp" && <DataExplorer />}
            {sidebarTab === "saved_query" && <SavedQuery />}
            {sidebarTab === "data_source" && (
              <DataSource
                connection={currentConnection}
                onChangeDataSource={() => {}}
              />
            )}
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
        {SIDEBAR_TABS.map((tab) => (
          <SidebarTab
            key={tab.id}
            tab={tab}
            isActive={sidebarTab === tab.id}
            onSelect={(tabId: string) =>
              setSidebarTab(tabId as "data_exp" | "saved_query" | "data_source")
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
