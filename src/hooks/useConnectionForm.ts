import { useState, useEffect } from "react";
import { ConnectionData } from "@/types/connection";
import { useNavigate } from "react-router-dom";

export type DialogType = 
  | "name-conflict" 
  | "config-conflict" 
  | "validation-error" 
  | null;

export const useConnectionForm = (
  selectedConnection: ConnectionData | null
) => {
  const navigate = useNavigate();
  const [connectionType, setConnectionType] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: "",
    username: "",
    password: "",
    database: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | "warning" | "info" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  // Dialog state management
  const [dialogState, setDialogState] = useState<{
    type: DialogType;
    isOpen: boolean;
    title: string;
    message: string;
    existingConnection?: any;
  }>({
    type: null,
    isOpen: false,
    title: "",
    message: "",
  });

  const resetStatus = () => {
    setStatus({ type: null, message: "" });
  };

  const closeDialog = () => {
    setDialogState({
      type: null,
      isOpen: false,
      title: "",
      message: "",
    });
  };

  const showDialog = (
    type: DialogType,
    title: string,
    message: string,
    existingConnection?: any
  ) => {
    setDialogState({
      type,
      isOpen: true,
      title,
      message,
      existingConnection,
    });
  };

  useEffect(() => {
    if (selectedConnection) {
      setConnectionType(selectedConnection.type.toLowerCase());
      setFileName(null);
      setFormData({
        name: selectedConnection.name ?? "",
        host: selectedConnection.host ?? "",
        port: selectedConnection.port?.toString() ?? "",
        username: "",
        password: "",
        database: "",
      });
    } else {
      setConnectionType("");
      setFileName(null);
      setFormData({
        name: "",
        host: "",
        port: "",
        username: "",
        password: "",
        database: "",
      });
    }
    resetStatus();
  }, [selectedConnection]);

  const handleTestConnection = async () => {
    try {
      const response = await window.ipcRenderer.invoke(
        "test-mysql-connection",
        {
          host: formData.host,
          port: formData.port,
          username: formData.username,
          password: formData.password,
          database: formData.database,
        }
      );
      if (response.success) {
        setStatus({ type: "success", message: "Connected to the database." });
      } else {
        setStatus({
          type: "error",
          message: response.message || "Connection failed.",
        });
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Unexpected error occurred.",
      });
    }
  };

  const validateForm = () => {
    const missingFields = [];
    if (!formData.name) missingFields.push("Name");
    if (!formData.host) missingFields.push("Host");
    if (!formData.port) missingFields.push("Port");
    if (!formData.username) missingFields.push("Username");

    if (missingFields.length > 0) {
      showDialog(
        "validation-error",
        "Missing Required Fields",
        `Please fill in the following required fields: ${missingFields.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    resetStatus();

    try {
      // Step 1: Test MySQL Connection
      const response = await window.ipcRenderer.invoke(
        "test-mysql-connection",
        {
          host: formData.host,
          port: formData.port,
          username: formData.username,
          password: formData.password,
          database: formData.database,
        }
      );

      if (!response.success) {
        setStatus({
          type: "error",
          message: response.message || "Connection test failed.",
        });
        return;
      }

      // Step 2: Attempt Save
      const saveResponse = await window.ipcRenderer.invoke("save-connection", {
        name: formData.name,
        type: connectionType,
        host: formData.host,
        port: formData.port,
        username: formData.username,
        database: formData.database,
      });

      if (saveResponse.success) {
        setStatus({ type: "success", message: "Connection saved!" });
        setTimeout(() => navigate("/query"), 800);
        return;
      }

      // Step 3: Handle Conflicts with Dialogs
      if (saveResponse.conflict === "name") {
        showDialog(
          "name-conflict",
          "Connection Name Exists",
          "A connection with this name already exists. Do you want to overwrite it?",
          saveResponse.existing
        );
      } else if (saveResponse.conflict === "config") {
        showDialog(
          "config-conflict",
          "Similar Connection Found",
          "A connection with the same host/port/username exists but with a different name. Do you want to update its name or create new?",
          saveResponse.existing
        );
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Unexpected error occurred.",
      });
    }
  };

  const handleDialogAction = async (action: string) => {
    try {
      switch (dialogState.type) {
        case "name-conflict":
          if (action === "save") {
            await window.ipcRenderer.invoke("update-connection-by-name", {
              name: formData.name,
              type: connectionType,
              host: formData.host,
              port: formData.port,
              username: formData.username,
              database: formData.database,
            });
            setStatus({ type: "success", message: "Connection updated!" });
            setTimeout(() => navigate("/query"), 800);
          }
          break;

        case "config-conflict":
          if (action === "update") {
            await window.ipcRenderer.invoke("update-connection-name-by-config", {
              name: formData.name,
              host: formData.host,
              port: formData.port,
              username: formData.username,
            });
            setStatus({ type: "success", message: "Connection name updated!" });
            setTimeout(() => navigate("/query"), 800);
          } else if (action === "create") {
            // Force create new connection (you might need to implement this in your backend)
            const forceResponse = await window.ipcRenderer.invoke("force-create-connection", {
              name: formData.name,
              type: connectionType,
              host: formData.host,
              port: formData.port,
              username: formData.username,
              database: formData.database,
            });
            if (forceResponse.success) {
              setStatus({ type: "success", message: "New connection created!" });
              setTimeout(() => navigate("/query"), 800);
            }
          }
          break;

        case "validation-error":
          // Just close the dialog, user needs to fill the form
          break;
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "An error occurred while processing your request.",
      });
    }
    
    closeDialog();
  };

  return {
    connectionType,
    setConnectionType,
    fileName,
    setFileName,
    formData,
    setFormData,
    status,
    dialogState,
    handleTestConnection,
    handleSubmit,
    handleDialogAction,
    closeDialog,
  };
};