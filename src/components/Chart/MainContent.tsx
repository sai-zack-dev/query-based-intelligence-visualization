import ChartSelection from "./main/ChartSelection";
import { ChartTab } from "@/screen/ChartGenerationPage";
import QueryResult from "./main/QueryResult";
import ChartPreview from "./main/ChartPreview";

interface MainContentProps {
  activeTab: ChartTab;
  setActiveCategoryId: (id: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  setActiveCategoryId,
}) => {
  return (
    <div className="mr-6 p-4 pt-3 rounded-xl bg-white shadow flex-grow transition-all duration-300">
      {activeTab === "type" && (
        <ChartSelection setActiveCategoryId={setActiveCategoryId} />
      )}
      {activeTab === "config" && <ChartPreview />}
      {/* {activeTab === "info" && <QueryResult />} */}
    </div>
  );
};

export default MainContent;

