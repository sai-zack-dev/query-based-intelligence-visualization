import React from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { SidebarData } from "../../types/sidebar";

export const LeftPanel: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  const sidebarClasses = `
    p-4 border-r sm:block hidden border-gray-200 bg-white rounded-e-xl shadow 
    transition-all duration-300
    ${sidebarActive ? `translate-x-0 min-w-[300px]` : "-translate-x-full w-0 overflow-hidden"}
  `.trim();

  const toggleButtonClasses = `
    absolute bg-white mx-2 p-3 rounded-full transition-all duration-300 hidden sm:block
    left-0 h-10 w-10 flex items-center justify-center
    ${sidebarActive ? `translate-x-[250px]` : "shadow translate-x-0"}
  `.trim();

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

        {/* Connections List */}
        <div className="space-y-2 overflow-y-auto max-h-[100vh] pr-1">
          
        </div>

        {/* Add Button */}
      </div>

      {/* Toggle Button */}
      <button
        className={toggleButtonClasses}
        onClick={toggleSidebar}
        type="button"
        aria-label={sidebarActive ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarActive ? <RiSidebarFoldLine size={16} /> : <RiSidebarUnfoldLine size={16} />}
      </button>
    </>
  );
};
