import React from "react";
import { MdCheckCircle, MdError, MdWarning, MdInfo } from "react-icons/md";

interface AlertBoxProps {
  type: AlertType;
  message: string;
}

export type AlertType = "success" | "error" | "warning" | "info";

export const AlertBox: React.FC<AlertBoxProps> = ({ type, message }) => {
  const variants = {
    success: {
      icon: <MdCheckCircle className="text-green-600 text-xl" />,
      label: "Success!",
      classes: "text-green-800 bg-green-100 border border-green-300",
    },
    error: {
      icon: <MdError className="text-red-600 text-xl" />,
      label: "Error!",
      classes: "text-red-800 bg-red-100 border border-red-300",
    },
    warning: {
      icon: <MdWarning className="text-yellow-600 text-xl" />,
      label: "Warning!",
      classes: "text-yellow-800 bg-yellow-100 border border-yellow-300",
    },
    info: {
      icon: <MdInfo className="text-blue-600 text-xl" />,
      label: "Info!",
      classes: "text-blue-800 bg-blue-100 border border-blue-300",
    },
  };

  const { icon, label, classes } = variants[type];

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-md border-s-5 ${classes}`}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="text-sm">
        <strong className="font-medium mr-1">{label}</strong>
        {message}
      </div>
    </div>
  );
};
