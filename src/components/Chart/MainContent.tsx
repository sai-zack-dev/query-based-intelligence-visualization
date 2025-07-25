import ChartSelection from "./main/ChartSelection";
import ChartPreview from "./main/ChartPreview";
import { useChart } from "@/context/ChartContext";

const MainContent: React.FC = () => {
  const {
    activeTab,
  } = useChart();
  return (
    <div className="mr-6 pt-3 rounded-xl bg-white shadow flex-grow transition-all duration-300">
      {activeTab === "type" && (
        <ChartSelection />
      )}
      {activeTab === "config" && <ChartPreview />}
      {/* {activeTab === "info" && <QueryResult />} */}
    </div>
  );
};

export default MainContent;
