import { RiDashboardLine } from "react-icons/ri";
import { StepProgress } from "./StepProgress";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm">
      <div className="max-w-screen mx-auto flex items-center justify-between py-3 gap-5">
        <div className="flex p-3 my-3 items-center bg-white shadow-md rounded-e-xl min-w-30">
          <img src="./logo.png" alt="QBIV Logo" className="w-6 h-6" />
          <div className="font-bold text-lg ml-3 text-blue-500 hidden sm:flex gap-5">
            <span>QBIV</span>{" "}
          </div>
        </div>

        <StepProgress />

        <Link
          to="/dashboard"
          className="flex p-3 bg-white shadow-md rounded-s-xl"
        >
          <RiDashboardLine className="w-6 h-6 text-blue-500" />
        </Link>
      </div>
    </div>
  );
};
