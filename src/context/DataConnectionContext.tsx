import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectionData, ConnectionType, FormData } from "@/types/connection";

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

interface DataConnectionContextType {
  // Saved connections
  connections: ConnectionData[];
  connectionType: ConnectionType | "";
  setConnectionType: (type: ConnectionType | "") => void;
  selectedConnection: ConnectionData | null;
  setSelectedConnection: (connection: ConnectionData | null) => void;

  refreshConnections: () => Promise<void>;

  // Connection form
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  fileNames: string[];
  setFileNames: React.Dispatch<React.SetStateAction<string[]>>;
  status: { type: string | null; message: string };
  resetStatus: () => void;
  handleTestConnection: () => Promise<void>;
  handleSubmit: () => Promise<void>;
  initializeFromConnection: (conn: ConnectionData | null) => void;
}

const DataConnectionContext = createContext<
  DataConnectionContextType | undefined
>(undefined);

export const DataConnectionProvider: React.FC<{
  children: React.ReactNode;
  onDialogTrigger?: DialogTrigger;
}> = ({ children, onDialogTrigger }) => {
  const navigate = useNavigate();

  // 🟦 Saved connections
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionData | null>(null)

  const refreshConnections = async () => {
    try {
      const result = await window.ipcRenderer.invoke("get-connections");
      setConnections(result);
    } catch (err) {
      console.error("Failed to fetch saved connections:", err);
    }
  };

  // 🟩 Connection form
  const [connectionType, setConnectionType] = useState<ConnectionType | "">("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    host: "",
    port: "",
    username: "",
    password: "",
    database: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const resetStatus = () => setStatus({ type: "", message: "" });

  const initializeFromConnection = (conn: ConnectionData | null) => {
    if (conn) {
      setConnectionType(conn.type.toLowerCase() as ConnectionType);
      setFileNames([]);
      setFormData({
        name: conn.name || "",
        host: conn.host || "",
        port: conn.port?.toString() || "",
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
  };

  useEffect(() => {
    refreshConnections();
  }, []);

  useEffect(() => {
    initializeFromConnection(selectedConnection);
  }, [selectedConnection]);

  const validateForm = () => {
    const missing = [];
    if (!formData.name) missing.push("Name");
    if (!formData.host) missing.push("Host");
    if (!formData.port) missing.push("Port");
    if (!formData.username) missing.push("Username");

    if (missing.length) {
      onDialogTrigger?.(
        "validation-error",
        "Missing Required Fields",
        `Please fill in the following: ${missing.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleTestConnection = async () => {
    resetStatus();
    try {
      const response = await window.ipcRenderer.invoke(
        "test-mysql-connection",
        formData
      );
      if (response.success) {
        setStatus({ type: "success", message: "Connected to the database." });
      } else {
        setStatus({
          type: "error",
          message: response.message || "Failed to connect.",
        });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Unexpected error." });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const connectionPayload = {
      ...formData,
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

    try {
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

      const saveResponse = await window.ipcRenderer.invoke(
        "save-connection",
        savePayload
      );
      const fullConnection = { ...connectionPayload, id: saveResponse.id };

      const connectAndNavigate = async (message: string) => {
        const connectRes = await window.ipcRenderer.invoke(
          "connect-to-database",
          fullConnection
        );
        if (connectRes.success) {
          setStatus({ type: "success", message });
          setTimeout(() => navigate("/query"), 800);
        } else {
          setStatus({
            type: "error",
            message: connectRes.message || "Failed to connect.",
          });
        }
      };

      if (saveResponse.success) {
        await connectAndNavigate("Connected to the database.");
        return;
      }

      if (saveResponse.conflict === "name") {
        onDialogTrigger?.(
          "name-conflict",
          "Connection Name Exists",
          "A connection with this name already exists. Overwrite it?",
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
      }

      if (saveResponse.conflict === "config") {
        onDialogTrigger?.(
          "config-conflict",
          "Similar Connection Found",
          "A connection with the same host/port/username exists. Update its name or create new?",
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
              await connectAndNavigate("Name updated!");
            } else if (action === "create") {
              const forceRes = await window.ipcRenderer.invoke(
                "force-create-connection",
                savePayload
              );
              if (forceRes.success) {
                const fullForced = { ...connectionPayload, id: forceRes.id };
                const connectRes = await window.ipcRenderer.invoke(
                  "connect-to-database",
                  fullForced
                );
                if (connectRes.success) {
                  setStatus({
                    type: "success",
                    message: "New connection created!",
                  });
                  setTimeout(() => navigate("/query"), 800);
                } else {
                  setStatus({
                    type: "error",
                    message: connectRes.message || "Connect failed.",
                  });
                }
              } else {
                setStatus({
                  type: "error",
                  message: forceRes.message || "Create failed.",
                });
              }
            }
          }
        );
      }
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Unexpected error." });
    }
  };

  return (
    <DataConnectionContext.Provider
      value={{
        connections,
        refreshConnections,
        connectionType,
        setConnectionType,
        formData,
        setFormData,
        fileNames,
        setFileNames,
        status,
        resetStatus,
        handleTestConnection,
        handleSubmit,
        initializeFromConnection,

        selectedConnection,
        setSelectedConnection
      }}
    >
      {children}
    </DataConnectionContext.Provider>
  );
};

export const useDataConnection = () => {
  const ctx = useContext(DataConnectionContext);
  if (!ctx)
    throw new Error(
      "useDataConnection must be used within DataConnectionProvider"
    );
  return ctx;
};
