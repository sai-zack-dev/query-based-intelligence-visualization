import { ChartName, ChartTemplateProps } from "@/types/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Props {
  type: ChartName;
  data: any[];
  config: Partial<ChartTemplateProps>;
}

const BarChartTemplate: React.FC<Props> = ({ type, data, config }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        {config.strokeDasharray && (
          <CartesianGrid strokeDasharray={config.strokeDasharray} />
        )}
        {config.xAxis && <XAxis dataKey={config.xKey} />}
        {config.yAxis && <YAxis />}
        {config.tooltip && <Tooltip />}
        {config.legend && <Legend />}

        {config.bars
          ?.filter((bar) => bar.active)
          .map((bar, idx) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              fill={bar.fill}
              stackId={type === "StackedBar" ? bar.stackId || "a" : undefined}
            />
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartTemplate;
