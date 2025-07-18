import { useEffect, useState } from "react";
import { ConnectionData } from "@/types/connection";

export const useSavedConnections = () => {
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [activeConnectionId, setActiveConnectionId] = useState<number | null>(null);

  const fetchConnections = async () => {
    try {
      const result = await window.ipcRenderer.invoke("get-connections");
      setConnections(result);
    } catch (error) {
      console.error("Failed to fetch saved connections:", error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return {
    connections,
    activeConnectionId,
    setActiveConnectionId,
    refreshConnections: fetchConnections,
  };
};
