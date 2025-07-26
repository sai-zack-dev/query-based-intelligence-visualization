import { getDatabase } from "./core";

export function addChart(chart: {
  uuid: string;
  title: string;
  type: string;
  config: string;
  data: string;
  query_result?: string;
}) {
  const db = getDatabase(); // ⬅ moved here
  db.prepare(`
    INSERT INTO charts (uuid, title, type, config, data, query_result)
    VALUES (@uuid, @title, @type, @config, @data, @query_result)
  `).run(chart);
}
