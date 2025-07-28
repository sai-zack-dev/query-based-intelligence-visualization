import { useChart } from "@/context/ChartContext";
import { useMemo } from "react";
import BarChartTemplate from "../template/BarChartTemplate";

const ChartPreview: React.FC = () => {
  const { chartType, lines, xKey, chartData } = useChart();

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

      <BarChartTemplate
        name={chartType}
        data={chartData}
        xKey={xKey}
        bars={activeLines.map((line) => ({
          dataKey: line.dataKey,
          fill: line.color,
          active: line.active,
          stackId: chartType === "StackedBar" ? "a" : undefined,
          activeBar: chartType === "SimpleBar" ? true : undefined,
        }))}
      />

      <h1 className="w-full text-center pb-5 text-sm text-muted-foreground">
        {chartType}
      </h1>
    </>
  );
};

export default ChartPreview;
