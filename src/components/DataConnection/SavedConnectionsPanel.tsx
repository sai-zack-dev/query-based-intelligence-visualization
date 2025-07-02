import React from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { SavedConnectionCard } from "./SavedConnectionCard";

interface SavedConnectionsPanelProps {
  sidebarActive: boolean;
  toggleSidebar: () => void;
}

interface ConnectionData {
  id: string;
  name: string;
  type: "MySQL" | "SQLite" | "Excel" | "CSV";
  host: string;
  date: string;
}

const MOCK_CONNECTIONS: ConnectionData[] = [
  {
    id: "1",
    name: "Sales DB",
    type: "MySQL",
    host: "localhost",
    date: "27/06/2025",
  },
  {
    id: "2",
    name: "Warehouse Data",
    type: "SQLite",
    host: "warehouse.db",
    date: "27/06/2025",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    type: "Excel",
    host: "marketing_campaign.xlsx",
    date: "26/06/2025",
  },
  {
    id: "4",
    name: "Marketing Campaign CSV",
    type: "CSV",
    host: "marketing_campaign.csv",
    date: "26/06/2025",
  },
];

const SIDEBAR_WIDTH = 300;
const TOGGLE_BUTTON_OFFSET = 250;

export const SavedConnectionsPanel: React.FC<SavedConnectionsPanelProps> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  const sidebarClasses = `
    p-4 border-r sm:block hidden border-gray-200 bg-white rounded-e-xl shadow 
    transition-all duration-300
    ${
      sidebarActive
        ? `translate-x-0 min-w-[${SIDEBAR_WIDTH}px]`
        : "-translate-x-full w-0 overflow-hidden"
    }
  `.trim();

  const headerClasses = `
    flex items-center justify-between mb-4 border-b pb-3 border-gray-200
    ${sidebarActive ? "block" : "hidden"}
  `.trim();

  const addButtonClasses = `
    w-full mt-4 text-xs cursor-pointer btn-outline 
    ${sidebarActive ? "block" : "hidden"}
  `.trim();

  const toggleButtonClasses = `
    absolute bg-white mx-2 p-3 rounded-full transition-all duration-300 hidden sm:block
    left-0 h-10 w-10 flex items-center justify-center
    ${
      sidebarActive
        ? `translate-x-[${TOGGLE_BUTTON_OFFSET}px]`
        : "shadow translate-x-0"
    }
  `.trim();

  const handleAddConnection = () => {
    // TODO: Implement add connection functionality
    console.log("Add new connection clicked");
  };

  return (
    <>
      {/* Sidebar Panel */}
      <div className={sidebarClasses}>
        {/* Header */}
        <div className={headerClasses}>
          <h2 className="font-semibold text-gray-800">
            Saved Connections
          </h2>
        </div>

        {/* Connections List */}
        <div className="space-y-2 overflow-y-auto max-h-[75vh] pr-1">
          {MOCK_CONNECTIONS.map((connection) => (
            <SavedConnectionCard
              key={connection.id}
              name={connection.name}
              type={connection.type}
              host={connection.host}
              date={connection.date}
            />
          ))}
        </div>

        {/* Add Connection Button */}
        <button
          className={addButtonClasses}
          onClick={handleAddConnection}
          type="button"
        >
          + Add New Connection
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
