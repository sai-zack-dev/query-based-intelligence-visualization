import { QueryTools } from "@/components/QueryBuilder/QueryTools";
import { LeftPanel } from "@/components/QueryBuilder/LeftPanel";
import { SidebarData } from "@/types/sidebar";
import { QueryBuilderProvider } from "@/context/QueryBuilderContext"; // ✅ import

const QueryBuilderPage: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  return (
    <QueryBuilderProvider>
      <LeftPanel sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
      <QueryTools />
    </QueryBuilderProvider>
  );
};

export default QueryBuilderPage;