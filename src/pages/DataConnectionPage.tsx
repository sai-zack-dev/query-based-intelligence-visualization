import React, { useState } from "react";
import { Navbar } from "../components/common/Navbar";
import { SavedConnectionsPanel } from "../components/DataConnection/SavedConnectionsPanel";
import { ConnectionForm } from "../components/DataConnection/ConnectionForm";
import { useSidebarToggle } from "../hooks/useSidebarToggle";
import { ConnectionData } from "../types/connection";

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

const DataConnectionPage = () => {
  const { sidebarActive, toggleSidebar } = useSidebarToggle();
  const [activeConnectionId, setActiveConnectionId] = useState<string | number | null>(null);

  const selectedConnection = MOCK_CONNECTIONS.find(c => c.id === activeConnectionId) ?? null;

  const handleAddNewConnection = () => {
    setActiveConnectionId(null); // clear form by deselecting
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-white to-sky-100">
      <Navbar />
      <div className="pt-20 flex justify-center items-start">
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
      </div>
    </div>
  );
};

export default DataConnectionPage;
