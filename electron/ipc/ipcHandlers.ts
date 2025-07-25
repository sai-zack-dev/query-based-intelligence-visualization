// electron/ipc/ipcHandlers.ts - IPC handlers setup
import { ipcMain } from "electron";
import { connectionManager } from "../services/connectionManager";
import { connectionService } from "../services/connectionService";

export function setupIpcHandlers() {
  // MySQL connection testing
  ipcMain.handle("test-mysql-connection", async (_, config) => {
    return await connectionManager.testConnection(config);
  });

  // Connection management
  ipcMain.handle("save-connection", async (_, conn) => {
    return await connectionService.saveConnection(conn);
  });

  ipcMain.handle("update-connection-by-name", async (_, conn) => {
    return await connectionService.updateConnectionByName(conn);
  });

  ipcMain.handle("update-connection-name-by-config", async (_, payload) => {
    return await connectionService.updateConnectionNameByConfig(payload);
  });

  ipcMain.handle("force-create-connection", async (_, conn) => {
    return await connectionService.forceCreateConnection(conn);
  });

  ipcMain.handle("get-connections", () => {
    return connectionService.getConnections();
  });

  // Database connection management
  ipcMain.handle("connect-to-database", async (_, conn) => {
    return await connectionManager.connectToDatabase(conn);
  });

  ipcMain.handle("disconnect-database", async () => {
    return await connectionManager.disconnect();
  });

  ipcMain.handle("get-active-connection-meta", async () => {
    return connectionManager.getActiveConnectionMeta();
  });

  // Database exploration
  ipcMain.handle("get-database-explorer-data", async () => {
    return await connectionManager.getDatabaseExplorerData();
  });

  ipcMain.handle(
    "run-sql-query",
    async (_, payload: { database: string; query: string }) => {
      try {
        const conn = connectionManager.getActiveConnection();
        if (!conn) return { success: false, message: "No DB connected" };

        await conn.query(`USE \`${payload.database}\``); // switch database
        const [rows] = await conn.query(payload.query);
        return { success: true, data: rows };
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    }
  );

}
