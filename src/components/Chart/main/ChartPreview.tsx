import { useChart } from "@/context/ChartContext";
import { renderChartTemplate } from "@/components/common/ChartRenderer";
import { useState } from "react";
import SaveToDashboardModal from "../sidebar/SaveToDashboardModal";
import { FaSave } from "react-icons/fa";
import { ExportButton } from "@/components/common/ExportButton";
import { useRef } from "react";

const ChartPreview: React.FC = () => {
  const { chartType, chartData, chartConfig, chartTitle } = useChart();
  const [open, setOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="px-4">
        <h2 className="border-b pb-3 border-gray-200 font-semibold text-gray-800">
          Chart Preview
        </h2>
      </div>
      {/* save btn and modal */}

      <div className="w-full flex justify-end p-3 gap-3">
        <ExportButton
          data={chartData}
          filename={chartTitle}
          chartRef={chartRef}
        />
        <button
          onClick={() => setOpen(true)}
          className={`btn-primary text-sm flex justify-center items-center gap-2 ${
            !chartConfig && "opacity-50 hover:bg-blue-500"
          }`}
          disabled={!chartConfig}
        >
          <FaSave />
          Save to Dashboard
        </button>
      </div>
      <div ref={chartRef} className="h-100 px-5 py-10">
        {chartConfig ? (
          renderChartTemplate({
            type: chartType,
            data: chartData,
            config: chartConfig,
          })
        ) : (
          <div className="w-full h-full flex justify-center items-center text-gray-300 p-2">
            No chart config available!
          </div>
        )}
      </div>

      <h1 className="w-full text-center pb-5 text-sm text-muted-foreground">
        {chartType}
      </h1>
      {chartConfig && (
        <SaveToDashboardModal
          open={open}
          onClose={() => setOpen(false)}
          chart={{
            title: chartTitle,
            type: chartType,
            config: chartConfig,
            data: chartData,
          }}
        />
      )}
    </>
  );
};

export default ChartPreview;
