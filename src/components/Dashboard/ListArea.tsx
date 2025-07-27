import { SidebarData } from "@/types/sidebar";
import { RiSidebarFoldLine, RiSidebarUnfoldLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export const ListArea: React.FC<SidebarData> = ({
  sidebarActive,
  toggleSidebar,
}) => {
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
  return (
    <div className="pt-6">
      <Link to="/" className={sidebarNav}>
        <img src="./logo.png" alt="QBIV Logo" className="w-6 h-6" />
        {sidebarActive && (
          <span className="font-bold text-lg text-blue-500">QBIV</span>
        )}
      </Link>

      {/* Sidebar Panel */}
      <div className={sidebarClasses}>
        {/* Header */}
        {sidebarActive && (
          <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
            <h2 className="font-semibold text-gray-800">Dashboards</h2>
          </div>
        )}
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
    </div>
  );
};

export default ListArea;
