import {
  getAllDashboards,
  addDashboard,
  linkChartToDashboard,
} from "../db/dashboards";

export const dashboardService = {
  getAllDashboards,

  createDashboard(name: string) {
    const { id } = addDashboard(name);
    return id;
  },

  linkChartToDashboard,
};
