import ChartSelection from "./main/ChartSelection";
import { ChartTab } from "@/screen/ChartGenerationPage";
import QueryResult from "./main/QueryResult";
import ChartPreview from "./main/ChartPreview";

interface MainContentProps {
  activeTab: ChartTab;
  setActiveTab: React.Dispatch<React.SetStateAction<ChartTab>>;
  setActiveCategoryId: (id: string) => void;
  chartType: string;
  setChartType: (chartType: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  setActiveTab,
  setActiveCategoryId,
  chartType,
  setChartType
}) => {
  return (
    <div className="mr-6 pt-3 rounded-xl bg-white shadow flex-grow transition-all duration-300">
      {activeTab === "type" && (
        <ChartSelection setActiveCategoryId={setActiveCategoryId} chartType={chartType} setChartType={setChartType} setActiveTab={setActiveTab} />
      )}
      {activeTab === "config" && <ChartPreview />}
      {/* {activeTab === "info" && <QueryResult />} */}
    </div>
  );
};

export default MainContent;
