import { useState, useEffect } from "react";
import { ConnectionData } from "@/types/connection";
import { useNavigate } from "react-router-dom";

export type DialogType =
  | "name-conflict"
  | "config-conflict"
  | "validation-error"
  | null;

type DialogTrigger = (
  type: DialogType,
  title: string,
  message: string,
  onAction?: (action: string) => void
) => void;

export const useConnectionForm = (
  selectedConnection: ConnectionData | null,
  onDialogTrigger?: DialogTrigger
) => {
  const navigate = useNavigate();

  const [connectionType, setConnectionType] = useState<string>("");
  const [fileNames, setFileNames] = useState<string[]>([]);
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

  const resetStatus = () => {
    setStatus({ type: null, message: "" });
  };

  useEffect(() => {
    if (selectedConnection) {
      setConnectionType(selectedConnection.type.toLowerCase());
      setFileNames([]);
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
      setFileNames([]);
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
      onDialogTrigger?.(
        "validation-error",
        "Missing Required Fields",
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    resetStatus();

    try {
      const connectionPayload = {
        host: formData.host,
        port: formData.port,
        username: formData.username,
        password: formData.password,
        database: formData.database,
        name: formData.name,
        type: connectionType,
      };

      const savePayload = {
        name: formData.name,
        type: connectionType,
        host: formData.host,
        port: formData.port,
        username: formData.username,
        database: formData.database,
      };

      // 1. Test connection
      const response = await window.ipcRenderer.invoke(
        "test-mysql-connection",
        connectionPayload
      );
      if (!response.success) {
        setStatus({
          type: "error",
          message: response.message || "Connection test failed.",
        });
        return;
      }

      // 2. Save connection (should return connection ID)
      const saveResponse = await window.ipcRenderer.invoke(
        "save-connection",
        savePayload
      );

      // 👇 Correct: merge ID into connectionPayload
      const fullConnection = {
        ...connectionPayload,
        id: saveResponse.id, // ⚠️ Make sure your save-connection handler returns { success: true, id: number }
      };

      const connectAndNavigate = async (successMessage: string) => {
        const connectResponse = await window.ipcRenderer.invoke(
          "connect-to-database",
          fullConnection
        );
        if (!connectResponse.success) {
          setStatus({ type: "error", message: connectResponse.message });
          return;
        }

        setStatus({ type: "success", message: successMessage });
        setTimeout(() => navigate("/query"), 800);
      };

      // 3. Success case
      if (saveResponse.success) {
        await connectAndNavigate("Connected!");
        return;
      }

      // 4. Name conflict
      if (saveResponse.conflict === "name") {
        onDialogTrigger?.(
          "name-conflict",
          "Connection Name Exists",
          "A connection with this name already exists. Do you want to overwrite it?",
          async (action) => {
            if (action === "save") {
              await window.ipcRenderer.invoke(
                "update-connection-by-name",
                savePayload
              );
              await connectAndNavigate("Connection updated!");
            }
          }
        );
        return;
      }

      // 5. Config conflict
      if (saveResponse.conflict === "config") {
        onDialogTrigger?.(
          "config-conflict",
          "Similar Connection Found",
          "A connection with the same host/port/username exists but with a different name. Do you want to update its name or create a new one?",
          async (action) => {
            if (action === "update") {
              await window.ipcRenderer.invoke(
                "update-connection-name-by-config",
                {
                  name: formData.name,
                  host: formData.host,
                  port: formData.port,
                  username: formData.username,
                }
              );
              await connectAndNavigate("Connection name updated!");
            } else if (action === "create") {
              const forceResponse = await window.ipcRenderer.invoke(
                "force-create-connection",
                savePayload
              );
              if (forceResponse.success) {
                const fullForcedConnection = {
                  ...connectionPayload,
                  id: forceResponse.id, // again, forceCreateConnection should return id
                };
                const connectResponse = await window.ipcRenderer.invoke(
                  "connect-to-database",
                  fullForcedConnection
                );
                if (!connectResponse.success) {
                  setStatus({
                    type: "error",
                    message: connectResponse.message || "Failed to connect.",
                  });
                } else {
                  setStatus({
                    type: "success",
                    message: "New connection created!",
                  });
                  setTimeout(() => navigate("/query"), 800);
                }
              } else {
                setStatus({
                  type: "error",
                  message:
                    forceResponse.message || "Failed to create connection.",
                });
              }
            }
          }
        );
      }
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Unexpected error occurred.",
      });
    }
  };

  return {
    connectionType,
    setConnectionType,
    fileNames,
    setFileNames,
    formData,
    setFormData,
    status,
    handleTestConnection,
    handleSubmit,
  };
};
