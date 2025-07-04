import React, { useState } from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { SidebarData } from "../../types/sidebar";
import { FiDatabase, FiBookmark } from "react-icons/fi";
import { RiInformation2Line } from "react-icons/ri";

export const LeftPanel: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  const sidebarClasses = `
    p-4 pl-10 border-r sm:block hidden border-gray-200 bg-white rounded-e-xl shadow 
    transition-all duration-300
    ${
      sidebarActive
        ? `translate-x-0 min-w-[300px]`
        : "-translate-x-full w-0 overflow-hidden"
    }
  `.trim();

  const toggleButtonClasses = `
    absolute bg-white mx-2 p-3 rounded-full transition-all duration-300 hidden sm:block
    left-0 h-10 w-10 flex items-center justify-center
    ${sidebarActive ? `translate-x-[250px]` : "shadow translate-x-0"}
  `.trim();

  const [sidebarTab, setSidebarTab] = useState<"data_exp" | "saved_query" | "data_source">("data_exp");

  return (
    <>
      {/* Sidebar Panel */}
      <div className={sidebarClasses}>
        {/* Header */}
        {sidebarActive && (
          <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
            <h2 className="font-semibold text-gray-800">Data Explorer</h2>
          </div>
        )}
        {/* Sidebar Content */}
        <div className="flex flex-col gap-4 px-3">
          {sidebarTab === "data_exp" && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Data Explorer</h3>
              <p className="text-sm text-gray-500">Explore your data here.</p>
            </div>
          )}
          {sidebarTab === "saved_query" && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Saved Queries</h3>
              <p className="text-sm text-gray-500">Manage your saved queries.</p>
            </div>
          )}
          {sidebarTab === "data_source" && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Data Sources</h3>
              <p className="text-sm text-gray-500">Manage your data sources.</p>
            </div>
          )}
          </div>
      </div>

      {/* Sidebar Tabs */}
      <div className={`absolute flex flex-col left-0 top-40 bg-white rounded-e-xl ${!sidebarActive && "shadow"}`}>
        <button onClick={() => setSidebarTab("data_exp")} className={`p-3.5 ${sidebarTab === "data_exp" && "border-l-3 border-blue-500 text-blue-500"}`}>
          <FiDatabase size={17} />
        </button>
        <button onClick={() => setSidebarTab("saved_query")}  className={`p-3.5 ${sidebarTab === "saved_query" && " border-l-3 border-blue-500 text-blue-500"}`}>
          <FiBookmark size={17} />
        </button>
        <button onClick={() => setSidebarTab("data_source")}  className={`p-3.5 ${sidebarTab === "data_source" && " border-l-3 border-blue-500 text-blue-500"}`}>
          <RiInformation2Line size={17} />
        </button>
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
