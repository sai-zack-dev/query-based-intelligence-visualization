// MainArea.tsx
import { DashboardChart } from "@/types/chart";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { renderChartTemplate } from "@/components/common/ChartRenderer";

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
              className={`bg-blue-100 text-blue-500 font-bold text-sm text-center p-2 drag-handle ${
                isEdit ? "cursor-move" : ""
              }`}
            >
              {chart.title}
            </div>
            {renderChartTemplate({
              type: chart.type,
              data: JSON.parse(chart.data),
              config: JSON.parse(chart.config),
            })}
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default MainArea;
