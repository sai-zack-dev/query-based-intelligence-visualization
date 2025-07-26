import { ChartName } from "@/data/chartMeta";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Rectangle,
} from "recharts";

interface BarConfig {
  dataKey: string;
  fill: string;
  active: boolean;
  stackId?: string;
  activeBar?: boolean;
}

interface Props {
  name: ChartName; // "TinyBar" | "SimpleBar" | "StackedBar"
  data: any[];
  bars: BarConfig[];
  xKey: string;
}

const BarChartTemplate: React.FC<Props> = ({ name, data, bars, xKey }) => {
  return (
    <div className="h-100 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Shared Elements */}
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />

          {name !== "TinyBar" && <Legend />}
          {name !== "TinyBar" && <CartesianGrid strokeDasharray="3 3" />}

          {/* Bars */}
          {bars
            .filter((bar) => bar.active)
            .map((bar, idx) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill}
                stackId={name === "StackedBar" ? bar.stackId || "a" : undefined}
                activeBar={
                  name === "SimpleBar" && bar.activeBar
                    ? {
                        fill: idx % 2 === 0 ? "pink" : "gold",
                        stroke: idx % 2 === 0 ? "blue" : "purple",
                      }
                    : undefined
                }
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartTemplate;
