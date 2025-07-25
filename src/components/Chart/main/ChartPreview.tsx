// /components/Chart/ChartPreview.tsx
import { useChart } from "@/context/ChartContext";
import LineChartTemplate from "../template/LineChartTemplate";

const ChartPreview: React.FC = () => {
  const { chartType, lines } = useChart();

  const data = Array.from({ length: 6 }, (_, i) => ({
    name: `P${i + 1}`,
    uv: Math.floor(Math.random() * 400 + 100),
    pv: Math.floor(Math.random() * 400 + 100),
    amt: Math.floor(Math.random() * 400 + 100),
    // You can expand this with more fields if needed
  }));

  return (
    <>
      <div className="px-4">
        <h2 className="border-b pb-3 border-gray-200 font-semibold text-gray-800">
          Chart Preview
        </h2>
      </div>

      <LineChartTemplate
        name={chartType}
        data={data}
        lines={lines} // pulled from context
      />

      <h1 className="w-full text-center pb-5 text-sm text-muted-foreground">
        {chartType}
      </h1>
    </>
  );
};

export default ChartPreview;
