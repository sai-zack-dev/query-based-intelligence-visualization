import { getDatabase } from "./core";

export function addChart(chart: {
  uuid: string;
  title: string;
  type: string;
  config: string;
  data: string;
}) {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO charts (uuid, title, type, config, data)
    VALUES (@uuid, @title, @type, @config, @data)
  `).run(chart);
}
