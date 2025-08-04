import { ChartProvider } from "@/context/ChartContext";
import SidePanel from "@/components/Chart/SidePanel";
import MainContent from "@/components/Chart/MainContent";
import { SidebarData } from "@/types/sidebar";
import { useLocation } from "react-router-dom";

const ChartGenerationPage: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  const location = useLocation();
  const resultData = location.state?.data ?? [];

  return (
    <ChartProvider resultData={resultData}>
      <SidePanel sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
      <MainContent />
    </ChartProvider>
  );
};

export default ChartGenerationPage;
