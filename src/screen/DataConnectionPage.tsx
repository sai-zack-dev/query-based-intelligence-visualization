import React, { useState } from "react";
import { SavedConnectionsPanel } from "@/components/DataConnection/SavedConnectionsPanel";
import { ConnectionForm } from "@/components/DataConnection/ConnectionForm";
import { ConnectionDialog } from "@/components/common/ConnectionDialog";
import { useSavedConnections } from "@/hooks/useSavedConnections";
import { ConnectionData } from "@/types/connection";
import { DialogType } from "@/hooks/useConnectionForm";

interface Props {
  sidebarActive?: boolean;
  toggleSidebar?: () => void;
}

const DataConnectionPage: React.FC<Props> = ({
  sidebarActive = true,
  toggleSidebar = () => {},
}) => {
  const { connections, activeConnectionId, setActiveConnectionId } =
    useSavedConnections();

  const selectedConnection: ConnectionData | null =
    connections.find((c) => c.id === activeConnectionId) ?? null;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const openDialog = (type: DialogType, title: string, message: string) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const handleDialogAction = (action: string) => {
    console.log("Dialog action:", action);
    closeDialog();
  };

  const handleAddNewConnection = () => {
    setActiveConnectionId(null);
  };

  return (
    <>
      <SavedConnectionsPanel
        sidebarActive={sidebarActive}
        toggleSidebar={toggleSidebar}
        connections={connections}
        activeConnectionId={activeConnectionId}
        setActiveConnectionId={(id) =>
          setActiveConnectionId(typeof id === "string" ? parseInt(id) : id)
        }
        onAddNewConnection={handleAddNewConnection}
      />

      <ConnectionForm
        selectedConnection={selectedConnection}
        onDialogTrigger={() => console.log("trigger dialog")
        }
      />

      <ConnectionDialog
        isOpen={dialogOpen}
        type={dialogType}
        title={dialogTitle}
        message={dialogMessage}
        onAction={handleDialogAction}
        onCancel={closeDialog}
      />
    </>
  );
};

export default DataConnectionPage;
