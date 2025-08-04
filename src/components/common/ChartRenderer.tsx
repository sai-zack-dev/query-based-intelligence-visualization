import BarChartTemplate from "@/components/Chart/template/BarChartTemplate";
import PieChartTemplate from "@/components/Chart/template/PieChartTemplate";
import { ChartName } from "@/types/chart";
import { ChartTemplateProps } from "@/types/chart";

/**
 * A generic renderer that returns the correct template based on chart type
 */
export function renderChartTemplate({
  type,
  data,
  config,
}: {
  type: ChartName;
  data: any[];
  config: ChartTemplateProps;
}) {
  if (!type || !data || !config) {
    return <div className="text-sm text-red-500 p-2">Chart config missing</div>;
  }

  switch (type) {
    case "TinyBar":
    case "SimpleBar":
    case "StackedBar":
      return (
        <BarChartTemplate
          type={type}
          data={data}
          config={config}
        />
      );

    case "TwoLevelPie":
    case "StraightAnglePie":
    case "TwoSimplePie":
      return (
        <PieChartTemplate
          type={type}
          data={data}
          config={config}
        />
      );
    default:
      return <div className="text-sm text-red-500 p-2">Unsupported chart type</div>;
  }
}
