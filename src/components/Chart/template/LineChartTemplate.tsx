import { ChartName } from "@/data/chartMeta";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineConfig {
  dataKey: string;
  stroke: string;
  strokeDasharray?: string;
  yAxisId?: "left" | "right";
}

interface Props {
  name: ChartName;
  data: any[];
  lines: LineConfig[];
}

const LineChartTemplate: React.FC<Props> = ({ name, data, lines }) => {
  return (
    <div className="h-100 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip />
          <Legend />

          {/* Conditional Y Axis */}
          {name === "BiaxialLineChart" ? (
            <>
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
            </>
          ) : (
            <YAxis />
          )}

          {/* Render Lines Dynamically */}
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              activeDot={
                name === "SimpleLineChart" || name === "BiaxialLineChart"
                  ? { r: 8 }
                  : undefined
              }
              strokeDasharray={
                name === "DashedLineChart" ? line.strokeDasharray : undefined
              }
              yAxisId={name === "BiaxialLineChart" ? line.yAxisId : undefined}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartTemplate;
