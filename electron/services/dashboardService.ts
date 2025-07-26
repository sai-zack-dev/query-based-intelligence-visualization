import { getDatabase } from "../db/core";

export const dashboardService = {
  getAllDashboards() {
    const db = getDatabase();
    return db.prepare("SELECT * FROM dashboards").all();
  },

  createDashboard(name: string) {
    const db = getDatabase();
    const result = db
      .prepare("INSERT INTO dashboards (name) VALUES (?)")
      .run(name);
    return result.lastInsertRowid;
  },

  linkChartToDashboard(chartId: number, dashboardId: number) {
    const db = getDatabase();
    db.prepare(
      `
    INSERT INTO dashboard_charts (dashboard_id, chart_id)
    VALUES (?, ?)
  `
    ).run(dashboardId, chartId);
  },
};
