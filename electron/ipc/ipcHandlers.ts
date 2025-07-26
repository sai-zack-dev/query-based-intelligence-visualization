// electron/ipc/ipcHandlers.ts - IPC handlers setup
import { ipcMain } from "electron";
import { connectionManager } from "../services/connectionManager";
import { connectionService } from "../services/connectionService";
import { queryService } from "../services/queryService";
import { chartService } from "../services/chartService";
import { dashboardService } from "../services/dashboardService";

export function setupIpcHandlers() {
  // MySQL connection testing
  ipcMain.handle("test-mysql-connection", (_, config) =>
    connectionManager.testConnection(config)
  );

  // Connection management
  ipcMain.handle("save-connection", (_, conn) =>
    connectionService.saveConnection(conn)
  );

  ipcMain.handle("update-connection-by-name", (_, conn) =>
    connectionService.updateConnectionByName(conn)
  );

  ipcMain.handle("update-connection-name-by-config", (_, payload) =>
    connectionService.updateConnectionNameByConfig(payload)
  );

  ipcMain.handle("force-create-connection", (_, conn) =>
    connectionService.forceCreateConnection(conn)
  );

  ipcMain.handle("get-connections", () => connectionService.getConnections());

  // Database connection management
  ipcMain.handle("connect-to-database", (_, conn) =>
    connectionManager.connectToDatabase(conn)
  );

  ipcMain.handle("disconnect-database", () => connectionManager.disconnect());

  ipcMain.handle("get-active-connection-meta", () =>
    connectionManager.getActiveConnectionMeta()
  );

  // Database exploration
  ipcMain.handle("get-database-explorer-data", () =>
    connectionManager.getDatabaseExplorerData()
  );

  ipcMain.handle("run-sql-query", (_, payload) => queryService.runSQL(payload));

  ipcMain.handle("save-chart", (_, chartData) =>
    chartService.saveChart(chartData)
  );

  ipcMain.handle("get-dashboards", () => dashboardService.getAllDashboards());

  ipcMain.handle("create-dashboard", (_, name) =>
    dashboardService.createDashboard(name)
  );

  ipcMain.handle("link-chart-to-dashboard", (_, { chartId, dashboardId }) =>
    dashboardService.linkChartToDashboard(chartId, dashboardId)
  );
}
