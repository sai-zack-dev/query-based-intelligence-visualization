import ListArea from "@/components/Dashboard/ListArea";
import MainArea from "@/components/Dashboard/MainArea";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";
import { DashboardChart } from "@/types/chart";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DashboardsPage = () => {
  const { sidebarActive, toggleSidebar } = useSidebarToggle();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { dashboardId } = useParams();
  const [charts, setCharts] = useState<DashboardChart[]>([]);
  useEffect(() => {
    if (!dashboardId) return;
    window.ipcRenderer
      .invoke("get-dashboard-charts", Number(dashboardId))
      .then((res) => setCharts(res))
      .catch((err) => console.error("Failed to load charts", err));
  }, [dashboardId]);
  return (
    <div className="bg flex overflow-hidden">
      <ListArea
        sidebarActive={sidebarActive}
        toggleSidebar={toggleSidebar}
        setIsEdit={setIsEdit}
        isEdit={isEdit}
        dashboardId={Number(dashboardId)}
        charts={charts}
      />
      {dashboardId ? (
        <MainArea
          isEdit={isEdit}
          charts={charts}
          setCharts={setCharts}
        />
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-400 italic">
          Select a dashboard
        </div>
      )}
    </div>
  );
};

export default DashboardsPage;
