import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaLink, FaDatabase } from "react-icons/fa";
import { IoBarChart } from "react-icons/io5";
import clsx from "clsx";

const steps = [
  { path: "/", label: "Data Connection", icon: FaLink },
  { path: "/query", label: "Query Builder", icon: FaDatabase },
  { path: "/chart", label: "Chart Generation", icon: IoBarChart },
];

export const StepProgress: React.FC = () => {
  const location = useLocation();
  const currentIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );

  return (
    <div className="flex justify-around w-full max-w-screen-md">
      {steps.map((step, index) => {
        const Icon = step.icon;

        let status: "complete" | "active" | "disabled" = "disabled";
        if (index < currentIndex) status = "complete";
        else if (index === currentIndex) status = "active";

        const circleStyle = clsx(
          "rounded-full flex items-center justify-center",
          {
            "w-12 h-12 bubble-wrap":
              status === "active",
            "w-10 h-10 bg-blue-500 text-white inset-ring-2 inset-ring-gray-100":
              status === "complete",
            "w-10 h-10 bg-gray-200 text-gray-400 inset-ring-2 inset-ring-gray-100":
              status === "disabled",
          }
        );

        const labelStyle = clsx("text-xs text-center mt-2", {
          "text-blue-500 font-medium": status === "active",
          "text-gray-500": status !== "active",
        });

        const lineStyle = clsx(
          "w-full h-px mx-2 mt-6 rounded-full",
          (currentIndex === 1 && index === 0) || currentIndex === 2
            ? "bg-blue-400"
            : "bg-gray-300"
        );

        const showLine = index < steps.length - 1;

        return (
          <>
            <div key={step.label} className="flex">
              <Link
                to={step.path}
                className="flex flex-col items-center min-w-30"
              >
                <div className="shadow-md rounded-full">
                  <div className={circleStyle}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <span className={labelStyle}>{step.label}</span>
              </Link>
            </div>
            {showLine && <div className={lineStyle}></div>}
          </>
        );
      })}
    </div>
  );
};
