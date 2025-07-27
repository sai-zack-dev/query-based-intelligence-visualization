import { getDatabase } from "./core";

export function addChart(chart: {
  uuid: string;
  title: string;
  type: string;
  config: string;
  data: string;
}) {
  const db = getDatabase();
  return db.prepare(`
    INSERT INTO charts (uuid, title, type, config, data)
    VALUES (@uuid, @title, @type, @config, @data)
  `).run(chart);
}

export function getChartsByDashboardId(dashboardId: number) {
  const db = getDatabase();

  const rows = db.prepare(`
    SELECT
      charts.id,
      charts.uuid,
      charts.title,
      charts.type,
      charts.config,
      charts.data,
      dashboard_charts.x,
      dashboard_charts.y,
      dashboard_charts.width,
      dashboard_charts.height
    FROM charts
    JOIN dashboard_charts ON charts.id = dashboard_charts.chart_id
    WHERE dashboard_charts.dashboard_id = ?
  `).all(dashboardId);

  return rows;
}