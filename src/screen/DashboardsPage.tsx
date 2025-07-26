import { Link } from "react-router-dom";

const DashboardsPage = () => {
  return (
    <div className="bg pt-6 flex">
      <div>
        <Link
        to="/"
        className="flex p-3 items-center bg-white shadow-md rounded-e-xl w-75"
      >
        <img src="./logo.png" alt="QBIV Logo" className="w-6 h-6" />
        <div className="font-bold text-lg ml-3 text-blue-500 hidden sm:flex gap-5">
          <span>QBIV</span> <span>|</span>
          <span>DASHBOARDS</span>
        </div>
      </Link>
      </div>
      <div className="main-content">📈 Dashboard UI Coming Soon...</div>
    </div>
  );
};

export default DashboardsPage;
