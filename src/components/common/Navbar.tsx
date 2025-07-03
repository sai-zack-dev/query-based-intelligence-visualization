import React from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { StepProgress } from "./StepProgress";

export const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-sm">
      <div className="max-w-screen mx-auto flex items-center justify-between py-3 gap-5">
        <div className="flex p-3 items-center bg-white shadow-md rounded-e-xl">
          <img src="./logo.png" alt="QBIV Logo" className="w-6 h-6" />
          <span className="font-bold text-lg ml-3 text-blue-500 hidden sm:block">QBIV</span>
        </div>

        {/* <StepProgress /> */}

        <div className="flex p-3 bg-white shadow-md rounded-s-xl">
          <BiSolidDashboard className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  );
};
