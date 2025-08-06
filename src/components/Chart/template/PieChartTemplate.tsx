import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { ChartName } from "@/types/chart";
import { ChartTemplateProps } from "@/types/chart";

interface Props {
  type: ChartName;
  data: any[];
  config: Partial<ChartTemplateProps>;
}
const PieChartTemplate: React.FC<Props> = ({ data, config }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        {config.pies?.map((pie, idx) => (
          <Pie
            key={idx}
            data={data[pie.dataIdx]}
            dataKey={pie.dataKey}
            cx={pie.cx ?? "50%"}
            cy={pie.cy ?? "50%"}
            outerRadius={pie.outerRadius ?? 80}
            innerRadius={pie.innerRadius}
            label={pie.label}
            startAngle={pie.startAngle}
            endAngle={pie.endAngle}
            isAnimationActive={true}
          >
            {data[idx].map((entry: { name: string }, index: number) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={pie.fills?.[index] ?? "black"}
              />
            ))}
          </Pie>
        ))}
        {config.tooltip && <Tooltip />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartTemplate;
