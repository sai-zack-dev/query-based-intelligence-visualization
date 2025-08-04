import { useChart } from "@/context/ChartContext";
import SettingForms from "./SettingForms";

export default function ChartSetting() {
  const { resultData, chartType, chartTitle, setChartTitle } = useChart();
  return (
    <>
      <h2 className="border-b pb-3 border-gray-200 font-semibold text-gray-800 mb-3 mr-4">
        Chart Preview
      </h2>
      <div className="pl-10 gap-4 flex flex-col overflow-auto max-h-[70vh] pr-4">
        {resultData.length > 0 ? (
          <>
            {/* common inputs */}
            <div>
              <label className="input-label">Chart Title</label>
              <input
                type="text"
                className="input"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title"
              />
            </div>
            <SettingForms chartType={chartType} />
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center text-gray-300 p-2">
            There's no result data!
          </div>
        )}
      </div>
    </>
  );
}
