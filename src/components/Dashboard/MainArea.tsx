// MainArea.tsx
import { DashboardChart } from "@/types/chart";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { renderChartTemplate } from "@/components/common/ChartRenderer";
import { Link } from "react-router-dom";
interface MainAreaProps {
  isEdit: boolean;
  charts: DashboardChart[];
  setCharts: React.Dispatch<React.SetStateAction<DashboardChart[]>>;
}

const MainArea: React.FC<MainAreaProps> = ({ isEdit, charts, setCharts }) => {
  const ReactGridLayout = WidthProvider(RGL);
  const layout: Layout[] = charts.map((chart) => ({
    i: chart.id.toString(),
    x: chart.x,
    y: chart.y,
    w: chart.width,
    h: chart.height,
  }));

  const handleLayoutChange = (layout: Layout[]) => {
    let hasChanged = false;

    const updated = charts.map((chart) => {
      const match = layout.find((item) => item.i === chart.id.toString());
      if (!match) return chart;

      const updatedChart = {
        ...chart,
        x: match.x,
        y: match.y,
        width: match.w,
        height: match.h,
      };

      if (
        chart.x !== updatedChart.x ||
        chart.y !== updatedChart.y ||
        chart.width !== updatedChart.width ||
        chart.height !== updatedChart.height
      ) {
        hasChanged = true;
      }

      return updatedChart;
    });

    if (hasChanged) {
      setCharts(updated);
    }
  };
  return (
    <div className="relative overflow-y-auto flex-grow pt-3 px-2 max-h-dvh">
      {charts.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center flex-col text-gray-400 gap-2">
          <span>There's no chart to show</span>
          <Link to="/" className="underline text-blue-500 text-sm">Start create a new chart </Link>
        </div>
      ) : (
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={10}
          rowHeight={100}
          containerPadding={[10, 10]}
          isResizable={isEdit}
          isDraggable={isEdit}
          draggableHandle=".drag-handle"
          useCSSTransforms={true}
          onLayoutChange={handleLayoutChange}
        >
          {charts.map((chart) => (
            <div
              key={chart.id}
              className="bg-white rounded-lg shadow overflow-hidden border border-blue-300"
            >
              <div
                className={`bg-blue-100 text-blue-500 text-sm font-bold p-2 drag-handle flex justify-center items-center ${
                  isEdit ? "cursor-move" : ""
                }`}
              >
                {chart.title}
              </div>
              <div style={{ height: `${chart.height * 10}vh` }}>
                {renderChartTemplate({
                  type: chart.type,
                  data: JSON.parse(chart.data),
                  config: JSON.parse(chart.config),
                })}
              </div>
            </div>
          ))}
        </ReactGridLayout>
      )}
    </div>
  );
};

export default MainArea;
