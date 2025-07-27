import { DashboardChart } from "@/types/chart";
import BarChartTemplate from "../Chart/template/BarChartTemplate";
import { ChartName } from "@/data/chartMeta";

export function renderChartTemplate(chart: DashboardChart) {
  let config: any = {};
  let data: any[] = [];

  try {
    config = JSON.parse(chart.config);
    data = JSON.parse(chart.data);
  } catch (err) {
    return (
      <div className="text-red-500 p-2 text-sm">
        Invalid chart data or config.
      </div>
    );
  }

  switch (chart.type) {
    case "SimpleBar":
      return (
        <BarChartTemplate
          name={chart.title as ChartName}
          data={data}
          xKey={config.xKey}
          bars={config.bars}
        />
      );

    case "LineChart":
      return (
        // <LineChartTemplate
        //   name={chart.title}
        //   data={data}
        //   xKey={config.xKey}
        //   lines={config.lines}
        // />
         <div className="text-yellow-500 text-sm italic">
          Unsupported chart type: {chart.type}
        </div>
      );

    default:
      return (
        <div className="text-yellow-500 text-sm italic">
          Unsupported chart type: {chart.type}
        </div>
      );
  }
}
