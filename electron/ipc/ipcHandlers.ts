// electron/ipc/ipcHandlers.ts - IPC handlers setup
import { ipcMain } from "electron";
import { connectionManager } from "../services/connectionManager";
import { connectionService } from "../services/connectionService";
import { queryService } from "../services/queryService";
import { chartService } from "../services/chartService";
import { dashboardService } from "../services/dashboardService";

export function setupIpcHandlers() {
  // Database connection management
  ipcMain.handle("test-mysql-connection", (_, config) =>
    connectionManager.testConnection(config)
  );

  ipcMain.handle("connect-to-database", (_, conn) =>
    connectionManager.connectToDatabase(conn)
  );

  ipcMain.handle("disconnect-database", () => connectionManager.disconnect());

  ipcMain.handle("get-active-connection-meta", () =>
    connectionManager.getActiveConnectionMeta()
  );

  ipcMain.handle("get-database-explorer-data", () =>
    connectionManager.getDatabaseExplorerData()
  );

  // Connection service
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

  // Query Service
  ipcMain.handle("run-sql-query", (_, payload) => queryService.runSQL(payload));

  ipcMain.handle("save-query", (_, query) => queryService.saveQuery(query));

  ipcMain.handle("get-saved-queries", () => queryService.getAllQueries());

  ipcMain.handle("delete-query", (_, id: number) =>
    queryService.deleteQueryById(id)
  );

  ipcMain.handle("get-query-by-id", (_, id: number) =>
    queryService.getQueryById(id)
  );

  // Chart Service
  ipcMain.handle("save-chart", (_, chartData) =>
    chartService.saveChart(chartData)
  );

  ipcMain.handle("get-dashboard-charts", async (_, dashboardId: number) =>
    chartService.getChartsByDashboardId(dashboardId)
  );

  //Dashboard Service
  ipcMain.handle("get-dashboards", () => dashboardService.getAllDashboards());

  ipcMain.handle("create-dashboard", (_, name) =>
    dashboardService.createDashboard(name)
  );

  ipcMain.handle("link-chart-to-dashboard", (_, { chartId, dashboardId }) =>
    dashboardService.linkChartToDashboard(chartId, dashboardId)
  );

  ipcMain.handle("update-dashboard-layout", (_, dashboardId, layouts) =>
    dashboardService.updateDashboardLayout(dashboardId, layouts)
  );

  ipcMain.handle("delete-dashboard", (_, dashboardId) =>
    dashboardService.deleteDashboardById(dashboardId)
  );
}
