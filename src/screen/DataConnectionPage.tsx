import React, { useState } from "react";
import { SavedConnectionsPanel } from "@/components/DataConnection/SavedConnectionsPanel";
import { ConnectionForm } from "@/components/DataConnection/ConnectionForm";
import { ConnectionDialog } from "@/components/common/ConnectionDialog";
import { DataConnectionProvider } from "@/context/DataConnectionContext";
import { DialogType } from "@/hooks/useConnectionForm";
import { SidebarData } from "@/types/sidebar";

const DataConnectionPage: React.FC<SidebarData> = ({
  sidebarActive = true,
  toggleSidebar = () => {},
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogCallback, setDialogCallback] = useState<
    ((action: string) => void) | null
  >(null);

  const openDialog = (
    type: DialogType,
    title: string,
    message: string,
    onAction?: (action: string) => void
  ) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogCallback(() => onAction || (() => {}));
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogCallback(null);
  };

  const handleDialogAction = (action: string) => {
    if (dialogCallback) dialogCallback(action);
    closeDialog();
  };

  return (
    <DataConnectionProvider onDialogTrigger={openDialog}>
      <SavedConnectionsPanel
        sidebarActive={sidebarActive}
        toggleSidebar={toggleSidebar}
      />

      <ConnectionForm />

      <ConnectionDialog
        isOpen={dialogOpen}
        type={dialogType}
        title={dialogTitle}
        message={dialogMessage}
        onAction={handleDialogAction}
        onCancel={closeDialog}
      />
    </DataConnectionProvider>
  );
};

export default DataConnectionPage;
