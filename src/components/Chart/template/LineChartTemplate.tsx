import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ChartName, ChartTemplateProps, LineConfig } from "@/types/chart";

interface Props {
  type: ChartName;
  data: any[];
  config: Partial<ChartTemplateProps>;
}

const LineChartTemplate: React.FC<Props> = ({ type, data, config }) => {
  const isVertical = type === "VerticalLine";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        layout={isVertical ? "vertical" : "horizontal"}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {config.strokeDasharray && (
          <CartesianGrid strokeDasharray={config.strokeDasharray} />
        )}
        {config.xAxis && (
          <XAxis
            dataKey={config.xKey}
            type={isVertical ? "number" : "category"}
          />
        )}
        {config.yAxis && (
          <YAxis
            dataKey={isVertical ? config.xKey : undefined}
            type={isVertical ? "category" : "number"}
          />
        )}
        {config.tooltip && <Tooltip />}
        {config.legend && <Legend />}

        {config.lines?.map((line: LineConfig) =>
          line.active ? (
            <Line
              key={line.dataKey}
              type={line.type || "monotone"}
              dataKey={line.dataKey}
              stroke={line.stroke || "#8884d8"}
              strokeDasharray={line.strokeDasharray}
              activeDot={line.activeDot}
            />
          ) : null
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartTemplate;
