import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ChartName, ChartTemplateProps, AreaConfig } from "@/types/chart";
import React from "react";

interface Props {
  type: ChartName;
  data: any[];
  config: Partial<ChartTemplateProps>;
}

const AreaChartTemplate: React.FC<Props> = ({ type, data, config }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        stackOffset={config.stackOffset}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        {config.strokeDasharray && (
          <CartesianGrid strokeDasharray={config.strokeDasharray} />
        )}
        {config.xAxis && <XAxis dataKey={config.xKey} />}
        {config.yAxis && <YAxis />}
        {config.tooltip && <Tooltip />}
        {config.legend && <Legend />}

        {type === "TargetedLineArea" && config.customDefs && (
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              {config.customDefs.map((val, idx) => (
                <stop offset={val.offset} stopColor={val.color} stopOpacity={val.opacity} />
              ))}
            </linearGradient>
          </defs>
        )}

        {config.areas?.map((area: AreaConfig, idx: number) =>
          area.active ? (
            <Area
              key={area.dataKey}
              type={area.type || "monotone"}
              dataKey={area.dataKey}
              stroke={area.stroke}
              fill={area.fill}
              stackId={area.stackId}
            />
          ) : null
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartTemplate;
