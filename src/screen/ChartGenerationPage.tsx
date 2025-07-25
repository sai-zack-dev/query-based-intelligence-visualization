// ChartGenerationPage.tsx
import { ChartProvider } from "@/context/ChartContext";
import SidePanel from "@/components/Chart/SidePanel";
import MainContent from "@/components/Chart/MainContent";
import { SidebarData } from "@/types/sidebar";

const ChartGenerationPage: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  return (
    <ChartProvider>
      <SidePanel sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
      <MainContent />
    </ChartProvider>
  );
};

export default ChartGenerationPage;
