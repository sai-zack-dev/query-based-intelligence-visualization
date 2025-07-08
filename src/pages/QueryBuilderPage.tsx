import { QueryTools } from "../components/QueryBuilder/QueryTools";
import { LeftPanel } from "../components/QueryBuilder/LeftPanel";
import { SidebarData } from "../types/sidebar";

const QueryBuilderPage: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
  return (
    <>
      <LeftPanel sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
      <QueryTools />
    </>
  );
};

export default QueryBuilderPage;
