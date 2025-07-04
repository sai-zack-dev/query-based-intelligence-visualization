import { QueryTools } from "../components/QueryBuilder/QueryTools";
import { LeftPanel } from "../components/QueryBuilder/LeftPanel";
import { SidebarData } from "../types/sidebar";

const QueryBuilderPage: React.FC<SidebarData> = ({ sidebarActive, toggleSidebar }) => {

  return (
    <div className="pt-25 flex justify-center items-start">
      <LeftPanel sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
      <QueryTools />
    </div>
  );
};

export default QueryBuilderPage;
