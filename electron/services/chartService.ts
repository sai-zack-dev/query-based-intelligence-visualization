import { addChart } from "../db/charts";

export const chartService = {
  async saveChart(chartData: {
    uuid: string;
    title: string;
    type: string;
    config: object;
    data: object;
    query_result?: string;
  }) {
    try {
      addChart({
        uuid: chartData.uuid,
        title: chartData.title,
        type: chartData.type,
        config: JSON.stringify(chartData.config),
        data: JSON.stringify(chartData.data),
        query_result: chartData.query_result || undefined,
      });

      return { success: true, message: "Chart saved locally." };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },
};
