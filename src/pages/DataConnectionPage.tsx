import { Navbar } from "../components/common/Navbar";
import { SavedConnectionsPanel } from "../components/DataConnection/SavedConnectionsPanel";
import { ConnectionForm } from "../components/DataConnection/ConnectionForm";
import { useSidebarToggle } from "../hooks/useSidebarToggle";

const DataConnectionPage = () => {
  const { sidebarActive, toggleSidebar } = useSidebarToggle();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-white to-sky-100">
      <Navbar />
      <div className="pt-20 flex justify-center">
        <SavedConnectionsPanel sidebarActive={sidebarActive} toggleSidebar={toggleSidebar} />
        <ConnectionForm sidebarActive={sidebarActive} />
      </div>
    </div>
  );
};

export default DataConnectionPage;