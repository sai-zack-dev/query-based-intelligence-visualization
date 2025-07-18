import React from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { SavedConnectionCard } from "./sidebar/SavedConnectionCard";
import { ConnectionData } from "@/types/connection";
import { SidebarData } from "@/types/sidebar";

interface SavedConnectionsPanelProps extends SidebarData {
  connections: ConnectionData[];
  activeConnectionId: string | number | null;
  setActiveConnectionId: (id: string | number) => void;
  onAddNewConnection: () => void;
}

export const SavedConnectionsPanel: React.FC<SavedConnectionsPanelProps> = ({
  sidebarActive,
  toggleSidebar,
  connections,
  activeConnectionId,
  setActiveConnectionId,
  onAddNewConnection,
}) => {
  const sidebarClasses = `
    sidebar
    ${
      sidebarActive
        ? `translate-x-0 min-w-[300px] w-[300px] lg:w-[400px] xl:w-[500px]`
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
        {/* Header */}
        {sidebarActive && (
          <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
            <h2 className="font-semibold text-gray-800">Saved Connections</h2>
          </div>
        )}

        {/* Connections List */}
        <div className="space-y-2 overflow-y-auto max-h-[100vh] pr-1">
          {connections.length === 0 ? (
            <p className="text-gray-500 text-center my-4">
              No saved connections
            </p>
          ) : (
            connections.map((connection) => (
              <SavedConnectionCard
                key={connection.id}
                connection={connection}
                active={connection.id === activeConnectionId}
                onClick={() => setActiveConnectionId(connection.id)}
              />
            ))
          )}
        </div>

        {/* Add Button */}
        {sidebarActive && (
          <button
            className="w-full mt-4 text-sm btn-outline"
            onClick={onAddNewConnection}
          >
            + Add New Connection
          </button>
        )}
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
