import React, { useState } from "react";
import { SavedConnectionsPanel } from "../components/DataConnection/SavedConnectionsPanel";
import { ConnectionForm } from "../components/DataConnection/ConnectionForm";
import { ConnectionData } from "../types/connection";
import { SidebarData } from "../types/sidebar";

const MOCK_CONNECTIONS: ConnectionData[] = [
  {
    id: "1",
    name: "Sales DB",
    type: "MySQL",
    host: "localhost",
    port: 3306,
    file: null,
    date: "27/06/2025",
  },
  {
    id: "2",
    name: "Warehouse Data",
    type: "SQLite",
    host: null,
    port: null,
    file: "warehouse.db",
    date: "27/06/2025",
  },
  {
    id: "3",
    name: "Marketing Campaign",
    type: "Excel",
    host: null,
    port: null,
    file: "marketing_campaign.xlsx",
    date: "26/06/2025",
  },
  {
    id: "4",
    name: "Marketing Campaign CSV",
    type: "CSV",
    host: null,
    port: null,
    file: "marketing_campaign.csv",
    date: "26/06/2025",
  },
];

const DataConnectionPage: React.FC<SidebarData> = ({ sidebarActive, toggleSidebar }) => {
  const [activeConnectionId, setActiveConnectionId] = useState<string | number | null>(null);

  const selectedConnection = MOCK_CONNECTIONS.find(c => c.id === activeConnectionId) ?? null;

  const handleAddNewConnection = () => {
    setActiveConnectionId(null);
  };

  return (
      <>
        <SavedConnectionsPanel
          sidebarActive={sidebarActive}
          toggleSidebar={toggleSidebar}
          connections={MOCK_CONNECTIONS}
          activeConnectionId={activeConnectionId}
          setActiveConnectionId={setActiveConnectionId}
          onAddNewConnection={handleAddNewConnection}
        />
        <ConnectionForm
          selectedConnection={selectedConnection}
        />
    </>
  );
};

export default DataConnectionPage;
