import { groupBy } from "lodash";
import { ChartTemplateProps, ChartName } from "@/types/chart";

export function transformChartData(
  chartType: ChartName,
  config: ChartTemplateProps | undefined,
  resultData: any[]
): any[] {
  if (!chartType || !config || !resultData?.length) return [];

  const { xKey, yKey, barsKey, bars, pies } = config;

  // === Bar chart ===
  if ((chartType === "TinyBar" || chartType === "SimpleBar" || chartType === "StackedBar") && xKey && yKey && barsKey) {
    const grouped = groupBy(resultData, (item) => item[xKey]);
    return Object.entries(grouped).map(([xVal, records]) => {
      const row: Record<string, any> = { [xKey]: xVal };
      for (const record of records) {
        const key = record[barsKey];
        const val = parseFloat(record[yKey]);
        if (key && !isNaN(val)) {
          row[key] = val;
        }
      }
      return row;
    });
  }

  // === Pie Charts: use pies[] with dataKey
  if (
    chartType === "TwoLevelPie" ||
    chartType === "StraightAnglePie" ||
    chartType === "TwoSimplePie"
  ) {
    return (pies ?? []).map((pie) => {
      const { dataKey } = pie;
      const grouped = groupBy(resultData, (item) => item.name || item[dataKey] || "Unknown");
      return Object.entries(grouped).map(([label, records]) => ({
        name: label,
        [dataKey]: records.reduce((acc, rec) => acc + Number(rec[dataKey] || 0), 0),
      }));
    });
  }

  return [];
}
