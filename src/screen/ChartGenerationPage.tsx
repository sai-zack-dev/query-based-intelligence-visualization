import { ChartProvider, useChart } from "@/context/ChartContext";
import SidePanel from "@/components/Chart/SidePanel";
import MainContent from "@/components/Chart/MainContent";
import { SidebarData } from "@/types/sidebar";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ChartGenerationPage: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  const location = useLocation();
  const resultData = location.state?.data ?? [];

  // Component that initializes resultData and default lines
  const ChartInitializer = ({ data }: { data: any[] }) => {
    const { setResultData, setLines } = useChart();

    useEffect(() => {
      if (!data.length) return;

      setResultData(data);

      const uniqueSeries = Array.from(
        new Set(data.map((item) => item.room_type).filter(Boolean))
      );

      const generateRandomColor = () =>
        "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

      const generatedLines = uniqueSeries.map((room) => ({
        dataKey: room,
        color: generateRandomColor(),
        active: true,
      }));

      setLines(generatedLines);
    }, [data]);

    return null;
  };

  return (
    <ChartProvider>
      <ChartInitializer data={resultData} />
      <SidePanel sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
      <MainContent />
    </ChartProvider>
  );
};

export default ChartGenerationPage;
