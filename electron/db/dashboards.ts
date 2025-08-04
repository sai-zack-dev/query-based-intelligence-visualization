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

export function linkChartToDashboard(
  chartId: number,
  dashboardId: number
): void {
  const db = getDatabase();
  db.prepare(
    `INSERT INTO dashboard_charts (dashboard_id, chart_id, x, y, width, height)
   VALUES (?, ?, ?, ?, ?, ?)`
  ).run(dashboardId, chartId, 0, 0, 4, 4);
}

export function getChartsByDashboardID(id: string) {
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
    .all(id)
    .map((c: any) => ({
      ...c,
      config: JSON.parse(c.config),
      data: JSON.parse(c.data),
    }));
}

export function updateDashboardLayout(
  dashboardId: number,
  layouts: { chart_id: number; x: number; y: number; width: number; height: number }[]
): void {
  const db = getDatabase();

  const stmt = db.prepare(
    `UPDATE dashboard_charts
     SET x = ?, y = ?, width = ?, height = ?
     WHERE dashboard_id = ? AND chart_id = ?`
  );

  for (const layout of layouts) {
    stmt.run(
      layout.x,
      layout.y,
      layout.width,
      layout.height,
      dashboardId,
      layout.chart_id
    );
  }
}

export function deleteDashboardById(id: number): void {
  const db = getDatabase();
  db.prepare("DELETE FROM dashboard_charts WHERE dashboard_id = ?").run(id);
  db.prepare("DELETE FROM dashboards WHERE id = ?").run(id);
}
