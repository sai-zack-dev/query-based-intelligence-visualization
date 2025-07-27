import { DashboardChart } from "@/types/chart";
import { useEffect, useState } from "react";
import RGL, { WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { renderChartTemplate } from "@/components/common/ChartRenderer";
interface MainAreaProps {
  isEdit: boolean;
  dashboardId: number | undefined;
}

const MainArea: React.FC<MainAreaProps> = ({ isEdit, dashboardId }) => {
  const ReactGridLayout = WidthProvider(RGL);
  const [charts, setCharts] = useState<DashboardChart[]>([]);

  useEffect(() => {
    if (!dashboardId) return;
    window.ipcRenderer
      .invoke("get-dashboard-charts", Number(dashboardId))
      .then((res) => setCharts(res))
      .catch((err) => console.error("Failed to load charts", err));
  }, [dashboardId]);

  const layout: Layout[] = charts.map((chart) => ({
    i: chart.id.toString(),
    x: chart.x,
    y: chart.y,
    w: chart.width,
    h: chart.height,
  }));
  return (
    <div className="relative overflow-y-auto flex-grow pt-3 px-2">
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
      >
        {charts.map((chart) => (
          <div
            key={chart.id}
            className="bg-white rounded-lg shadow overflow-hidden border border-blue-300"
          >
            <div
              className={`bg-blue-100 text-blue-500 font-bold text-sm text-center p-2 drag-handle ${
                isEdit && "cursor-move"
              }`}
            >
              {chart.title}
            </div>
            {renderChartTemplate(chart)}
            <p>
            {/* {chart.config} */}

            </p>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

export default MainArea;
