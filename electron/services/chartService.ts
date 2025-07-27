import { addChart, getChartsByDashboardId } from "../db/charts";
import { v4 as uuidv4 } from "uuid";

export const chartService = {
  async saveChart(chartData: {
    title: string;
    type: string;
    config: object;
    data: object;
    query_result?: string;
  }) {
    try {
      const result = addChart({
        uuid: uuidv4(),
        title: chartData.title,
        type: chartData.type,
        config: JSON.stringify(chartData.config),
        data: JSON.stringify(chartData.data),
      });

      return {
        success: true,
        message: "Chart saved locally.",
        id: result.lastInsertRowid, // <- return inserted chart ID
      };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },
  getChartsByDashboardId,
};
