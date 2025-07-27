import ListArea from "@/components/Dashboard/ListArea";
import MainArea from "@/components/Dashboard/MainArea";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { useState } from "react";
import { useParams } from "react-router-dom";

const DashboardsPage = () => {
  const { sidebarActive, toggleSidebar } = useSidebarToggle();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { dashboardId } = useParams();
  return (
    <div className="bg flex overflow-hidden">
      <ListArea sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} setIsEdit={setIsEdit} />
      {dashboardId ? (
        <MainArea isEdit={isEdit} dashboardId={Number(dashboardId)} />
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-400 italic">
          Select a dashboard to begin
        </div>
      )}
    </div>
  );
};

export default DashboardsPage;
