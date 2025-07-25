import { useChart } from "@/context/ChartContext";
import LineChartTemplate from "../template/LineChartTemplate";
import { groupBy } from "lodash";
import { useMemo } from "react";

const ChartPreview: React.FC = () => {
  const { chartType, lines, resultData, xKey, yKey, seriesKey } = useChart();

  // Generate chart data by grouping on xKey and seriesKey
  const chartData = useMemo(() => {
    if (!resultData || resultData.length === 0 || !xKey || !yKey || !seriesKey)
      return [];

    const grouped = groupBy(resultData, (item) => item[xKey]);

    return Object.entries(grouped).map(([xVal, records]) => {
      const row: Record<string, any> = { [xKey]: xVal };

      for (const record of records) {
        const seriesValue = record[seriesKey];
        const yVal = parseFloat(record[yKey]);
        if (seriesValue && !isNaN(yVal)) {
          row[seriesValue] = yVal;
        }
      }

      return row;
    });
  }, [resultData, xKey, yKey, seriesKey]);

  // Filter visible lines
  const activeLines = useMemo(
    () => lines.filter((line) => line.active),
    [lines]
  );

  return (
    <>
      <div className="px-4">
        <h2 className="border-b pb-3 border-gray-200 font-semibold text-gray-800">
          Chart Preview
        </h2>
      </div>

      <LineChartTemplate
        name={chartType}
        data={chartData}
        lines={activeLines}
        xKey={xKey}
      />

      <h1 className="w-full text-center pb-5 text-sm text-muted-foreground">
        {chartType}
      </h1>
    </>
  );
};

export default ChartPreview;
