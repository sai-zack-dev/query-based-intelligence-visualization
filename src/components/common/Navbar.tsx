import { BiSolidDashboard } from "react-icons/bi";
import { StepProgress } from "./StepProgress";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm">
      <div className="max-w-screen mx-auto flex items-center justify-between py-3 gap-5">
        <div
          className={`flex p-3 my-3 items-center bg-white shadow-md rounded-e-xl ${
            isDashboard ? "w-[300px]" : " w-40"
          }`}
        >
          <img src="./logo.png" alt="QBIV Logo" className="w-6 h-6" />
          <div className="font-bold text-lg ml-3 text-blue-500 hidden sm:flex gap-5">
            <span>QBIV</span>{" "}
            {isDashboard && (
              <>
                <span>|</span>
                <span>DASHBOARDS</span>
              </>
            )}
          </div>
        </div>

        {!isDashboard && <StepProgress />}

        <Link
          to={isDashboard ? "/" : "/dashboard"}
          className="flex p-3 bg-white shadow-md rounded-s-xl"
        >
          <BiSolidDashboard className="w-6 h-6 text-blue-500" />
        </Link>
      </div>
    </div>
  );
};
