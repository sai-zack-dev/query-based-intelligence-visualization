// src/components/DataConnection/SavedConnectionCard.tsx
import React from "react";

interface Props {
  name: string;
  type: "MySQL" | "SQLite" | "Excel" | "CSV";
  host: string;
  date: string;
}

export const SavedConnectionCard: React.FC<Props> = ({ name, type, host, date }) => {
  const typeColor = {
    MySQL: "bg-blue-100 text-blue-600",
    SQLite: "bg-purple-100 text-purple-600",
    Excel: "bg-green-100 text-green-600",
    CSV: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition">
      <div>
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-xs text-gray-500">host: {host}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
      <div className={`text-xs px-2 py-1 rounded ${typeColor[type]}`}>{type}</div>
    </div>
  );
};
