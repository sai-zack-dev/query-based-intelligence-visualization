import { SidebarData } from "@/types/sidebar";
import { useEffect, useState } from "react";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CheckIcon, PlusIcon } from "lucide-react";
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";

interface ListAreaProps extends SidebarData {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  dashboardId: number | undefined;
}

export const ListArea: React.FC<ListAreaProps> = ({
  sidebarActive,
  toggleSidebar,
  setIsEdit,
  dashboardId,
}) => {
  const [dashboards, setDashboards] = useState<{ id: number; name: string }[]>(
    []
  );
  const sidebarNav =
    `flex p-3 items-center bg-white shadow-md rounded-e-xl transition-all duration-300 gap-3
    ${sidebarActive ? `translate-x-0 w-30` : "w-12 overflow-hidden"}
  `.trim();
  const sidebarClasses = `
    sidebar mt-6
    ${
      sidebarActive
        ? `translate-x-0 min-w-[300px] w-[300px] lg:w-[350px] xl:w-[400px]`
        : "-translate-x-full w-0 overflow-hidden"
    }
  `.trim();

  const toggleButtonClasses = `
    sidebar-toggle top-25
    ${
      sidebarActive
        ? `translate-x-[250px] lg:translate-x-[300px] xl:translate-x-[350px]`
        : "shadow translate-x-0 bg-white"
    }
  `.trim();

  useEffect(() => {
    window.ipcRenderer
      .invoke("get-dashboards")
      .then((data) => setDashboards(data))
      .catch((err) => console.error("Failed to fetch dashboards:", err));
  }, []);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");

  const handleCreateDashboard = async () => {
    if (!newName.trim()) return;
    const id = await window.ipcRenderer.invoke(
      "create-dashboard",
      newName.trim()
    );
    const newDashboard = { id, name: newName.trim() };
    setDashboards((prev) => [...prev, newDashboard]);
    setNewName("");
    setCreatingNew(false);
  };

  return (
    <div className="pt-6">
      <Link to="/" className={sidebarNav}>
        <img src="../logo.png" alt="QBIV Logo" className="w-6 h-6" />
        {sidebarActive && (
          <span className="font-bold text-lg text-blue-500">QBIV</span>
        )}
      </Link>

      {/* Sidebar Panel */}
      <div className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
          <h2 className="font-semibold text-gray-800">Dashboards</h2>
        </div>
        {/* Dashboard List */}
        <div className="flex flex-col justify-between items-between min-h-30 pl-10">
          <div className="flex flex-col gap-1 pb-5">
            {dashboards.length === 0 ? (
              <p className="text-sm text-gray-400 px-3 py-2 italic text-center">
                No dashboards found
              </p>
            ) : (
              dashboards.map((dashboard) => (
                <Link
                  key={dashboard.id}
                  to={`/dashboard/${dashboard.id}`}
                  className={`px-3 py-2 rounded-md text-sm hover:bg-blue-50 text-gray-700 ${
                    dashboardId === dashboard.id &&
                    "bg-blue-100 text-blue-600 font-semibold"
                  }`}
                >
                  {dashboard.name}
                </Link>
              ))
            )}
          </div>
          {creatingNew ? (
            <>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New dashboard name"
              />
              <div className="flex gap-3 pt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={() => setCreatingNew(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-green-500 hover:bg-green-600 text-white cursor-pointer hover:text-white flex-1"
                  onClick={handleCreateDashboard}
                >
                  Confirm
                </Button>
              </div>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2"
              onClick={() => setCreatingNew(true)}
            >
              <PlusIcon className="mr-2 w-4 h-4" /> Add new dashboard
            </Button>
          )}
          {/* <Button
            size="sm"
            variant="outline"
            className="w-full mt-2"
            onClick={() => setIsEdit((prev) => !prev)}
          >
            Toggle Edit
          </Button> */}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        className={toggleButtonClasses}
        onClick={toggleSidebar}
        type="button"
        aria-label={sidebarActive ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarActive ? (
          <RiSidebarFoldLine size={16} />
        ) : (
          <RiSidebarUnfoldLine size={16} />
        )}
      </button>

      <div className="flex flex-col items-center gap-2 p-3">
        <button className="btn-primary w-full text-sm">
          <FaPencil className="mr-2" />
          {sidebarActive && "Edit"}
        </button>
        <button className="btn-primary w-full text-sm">
          <FaTrash className="mr-2" />
          {sidebarActive && "Delete"}
        </button>
      </div>
    </div>
  );
};

export default ListArea;
