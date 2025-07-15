import React, { useState } from "react";
import { SavedConnectionsPanel } from "@/components/DataConnection/SavedConnectionsPanel";
import { ConnectionForm } from "@/components/DataConnection/ConnectionForm";
import { SidebarData } from "@/types/sidebar";
import { CONNECTIONS } from "@/mock/MockData";

const DataConnectionPage: React.FC<SidebarData> = ({ sidebarActive, toggleSidebar }) => {
  const [activeConnectionId, setActiveConnectionId] = useState<string | number | null>(null);

  const selectedConnection = CONNECTIONS.find(c => c.id === activeConnectionId) ?? null;

  const handleAddNewConnection = () => {
    setActiveConnectionId(null);
  };

  return (
      <>
        <SavedConnectionsPanel
          sidebarActive={sidebarActive}
          toggleSidebar={toggleSidebar}
          connections={CONNECTIONS}
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
