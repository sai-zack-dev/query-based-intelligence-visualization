// src/electron/services/dashboardService.ts
import {
  getAllDashboards,
  addDashboard,
  linkChartToDashboard,
  updateDashboardLayout,
  deleteDashboardById,
} from "../db/dashboards";

export const dashboardService = {
  getAllDashboards,

  createDashboard(name: string) {
    const { id } = addDashboard(name);
    return id;
  },

  linkChartToDashboard,

  updateDashboardLayout,
  deleteDashboardById,
};
