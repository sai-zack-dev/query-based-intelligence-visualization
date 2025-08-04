import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { ChartName } from "@/types/chart";
import { ChartTemplateProps } from "@/types/chart";

interface Props {
  type: ChartName;
  data: any[];
  config: Partial<ChartTemplateProps>;
}

const PieChartTemplate: React.FC<Props> = ({ type, data, config }) => {
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
            fill={pie.fill}
            label={pie.label}
            startAngle={pie.startAngle}
            endAngle={pie.endAngle}
            isAnimationActive={true}
          />
        ))}
        {config.tooltip && <Tooltip />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartTemplate;
