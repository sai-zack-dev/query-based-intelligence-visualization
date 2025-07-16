import { useState, useEffect } from "react";
import { ConnectionData } from "@/types/connection";
import { useNavigate } from "react-router-dom";

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
  const resetStatus = () => {
    setStatus({ type: null, message: "" });
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

  const handleSubmit = async () => {
    resetStatus();

    try {
      // Step 1: Save the connection
      await window.ipcRenderer.invoke("save-connection", {
        name: formData.name,
        type: connectionType,
        host: formData.host,
        port: formData.port,
        username: formData.username,
        database: formData.database,
      });

      // Step 2: Test the connection
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

      // Step 3: If successful, redirect
      if (response.success) {
        setStatus({ type: "success", message: "Connection successful!" });
        console.log("handleSubmit end");

        // Delay slightly to show success message
        setTimeout(() => {
          navigate("/query"); // <-- your route for the next screen
        }, 800);
      } else {
        setStatus({
          type: "error",
          message: response.message || "Connection failed.",
        });
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
    fileName,
    setFileName,
    formData,
    setFormData,
    status,
    handleTestConnection,
    handleSubmit,
  };
};
