import React from "react";
import { ConnectionData } from "@/types/connection";

interface Props {
  connection: ConnectionData;
  active: boolean;
  onClick?: () => void;
}

export const SavedConnectionCard: React.FC<Props> = ({
  connection,
  active = false,
  onClick = () => {},
}) => {
  const { name, type, host, port, file, date } = connection;

  const getTypeColor = (type: string): string => {
    const colors = {
      mysql: "bg-teal-100 text-teal-600",
      sqlite: "bg-blue-100 text-blue-600",
      excel: "bg-green-100 text-green-600",
      csv: "bg-indigo-100 text-indigo-600",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  return (
    <div
      className={`flex items-center justify-between ${
        active ? "active-box" : "normal-box"
      }`}
      onClick={onClick}
    >
      <div>
        <h3 className="text-sm font-medium">{name}</h3>
        {host && (
          <p className="text-xs text-gray-500">
            {host}:{port}
          </p>
        )}
        {file && <p className="text-xs text-gray-500">{file}</p>}
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <div className={`text-xs px-3 py-1 rounded ${getTypeColor(type)}`}>
        {type}
      </div>
    </div>
  );
};
