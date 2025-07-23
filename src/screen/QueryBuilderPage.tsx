import { useEffect, useState } from "react";
import { QueryTools } from "@/components/QueryBuilder/QueryTools";
import { LeftPanel } from "@/components/QueryBuilder/LeftPanel";
import { SidebarData } from "@/types/sidebar";

type ConnectionMeta = {
  name: string;
  host: string;
  type: string;
  lastUpdate: string;
};

type ExplorerData = Record<
  string, // database name
  {
    tables: string[];
    schema: Record<string, any[]>;
  }
>;

const QueryBuilderPage: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  const [connectionMeta, setConnectionMeta] = useState<ConnectionMeta | null>(null);
  const [explorerData, setExplorerData] = useState<ExplorerData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metaRes = await window.ipcRenderer.invoke("get-active-connection-meta");
        if (metaRes.success) {
          setConnectionMeta(metaRes.meta);
        } else {
          console.warn("No active connection metadata found.");
        }

        const explorerRes = await window.ipcRenderer.invoke("get-database-explorer-data");
        if (explorerRes.success) {
          setExplorerData(explorerRes.explorer);
        } else {
          console.warn("No explorer data found.");
        }
      } catch (error) {
        console.error("Error fetching connection or explorer data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("🔗 Connection Info:", connectionMeta);
    console.log("🗂️ Explorer Data:", explorerData);
  }, [connectionMeta, explorerData]);

  return (
    <>
      <LeftPanel
        sidebarActive={sidebarActive}
        toggleSidebar={toggleSidebar}
        // You can pass the data like this if needed:
        connectionMeta={connectionMeta}
        explorerData={explorerData}
      />
      <QueryTools />
    </>
  );
};

export default QueryBuilderPage;
