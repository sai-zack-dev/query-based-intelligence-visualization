import React from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineLink, HiOutlineChartBar } from "react-icons/hi2";
import { HiOutlineDatabase } from "react-icons/hi";
import clsx from "clsx";

const steps = [
  { path: "/connection", label: "Data Connection", icon: HiOutlineLink },
  { path: "/query", label: "Query Builder", icon: HiOutlineDatabase },
  { path: "/chart", label: "Chart Generation", icon: HiOutlineChartBar },
];

export const StepProgress: React.FC = () => {
  const location = useLocation();
  const currentIndex = steps.findIndex((step) => step.path === location.pathname);

  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => {
        const Icon = step.icon;

        let status: "complete" | "active" | "disabled" = "disabled";
        if (index < currentIndex) status = "complete";
        else if (index === currentIndex) status = "active";

        const circleStyle = clsx(
          "w-12 h-12 rounded-full flex items-center justify-center shadow-md",
          {
            "bg-blue-100 border-4 border-blue-300": status === "active",
            "bg-blue-500 text-white": status === "complete",
            "bg-gray-200 text-gray-400": status === "disabled",
          }
        );

        const labelStyle = clsx("text-xs text-center", {
          "text-blue-500 font-medium": status === "active",
          "text-gray-500": status !== "active",
        });

        const showLine = index < steps.length - 1;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={circleStyle}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={labelStyle}>{step.label}</span>
            </div>
            {showLine && (
              <div className="w-12 h-px bg-blue-400 mx-2 mt-6 rounded-full"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};
