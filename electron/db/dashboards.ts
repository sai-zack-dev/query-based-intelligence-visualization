import { getDatabase } from "./core";
import { v4 as uuidv4 } from "uuid";

export interface Dashboard {
  id: number;
  uuid: string;
  name: string;
}

export function getAllDashboards(): Dashboard[] {
  const db = getDatabase();
  return db.prepare("SELECT * FROM dashboards").all() as Dashboard[];
}

export function addDashboard(name: string): { id: number; uuid: string } {
  const db = getDatabase();
  const uuid = uuidv4();
  const result = db
    .prepare("INSERT INTO dashboards (uuid, name) VALUES (?, ?)")
    .run(uuid, name);

  return { id: Number(result.lastInsertRowid), uuid };
}

export function linkChartToDashboard(chartId: number, dashboardId: number): void {
  const db = getDatabase();
  db.prepare(
    `
    INSERT INTO dashboard_charts (dashboard_id, chart_id)
    VALUES (?, ?)
  `
  ).run(dashboardId, chartId);
  
}

export function getChartsByDashboardUUID(uuid: string) {
  const db = getDatabase();

  return db
    .prepare(
      `
      SELECT charts.*
      FROM charts
      JOIN dashboard_charts ON dashboard_charts.chart_id = charts.id
      JOIN dashboards ON dashboards.id = dashboard_charts.dashboard_id
      WHERE dashboards.id = ?
    `
    )
    .all(uuid)
    .map((c: any) => ({
      ...c,
      config: JSON.parse(c.config),
      data: JSON.parse(c.data),
    }));
}
