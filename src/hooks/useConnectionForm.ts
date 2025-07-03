import { useState, useEffect } from "react";
import { ConnectionData } from "@/types/connection";

export const useConnectionForm = (
  selectedConnection: ConnectionData | null
) => {
  const [connectionType, setConnectionType] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: "",
    username: "",
    password: "",
  });
  
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (selectedConnection) {
      setConnectionType(selectedConnection.type.toLowerCase());
      setFileName(selectedConnection.file ?? null);
      setFormData({
        name: selectedConnection.name ?? "",
        host: selectedConnection.host ?? "",
        port: selectedConnection.port?.toString() ?? "",
        username: "",
        password: "",
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
      });
    }
    setStatus(null);
  }, [selectedConnection]);

  const handleTestConnection = () => {
    setStatus(null);
    setTimeout(() => {
      // Simulate success or failure
      const random = Math.random();
      setStatus(random < 0.5 ? "success" : "error");
    }, 500);
  };

  return {
    connectionType,
    setConnectionType,
    fileName,
    setFileName,
    formData,
    setFormData,
    status,
    handleTestConnection
  };
};
