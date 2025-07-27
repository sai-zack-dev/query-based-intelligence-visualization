import ListArea from "@/components/Dashboard/ListArea";
import MainArea from "@/components/Dashboard/MainArea";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";

const DashboardsPage = () => {
  const { sidebarActive, toggleSidebar } = useSidebarToggle();
  return (
    <div className="bg flex overflow-hidden">
      <ListArea sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
      <MainArea />
    </div>
  );
};

export default DashboardsPage;
