import React from "react";
import { ConnectionData } from "@/types/connection";
import { Link } from "react-router-dom";

type DataSourceProps = {
  connection: ConnectionData;
};

const DataSource: React.FC<DataSourceProps> = ({ connection }) => {
  const typeColor = {
    MySQL: "bg-teal-100 text-teal-600",
    SQLite: "bg-blue-100 text-blue-600",
    Excel: "bg-green-100 text-green-600",
    CSV: "bg-indigo-100 text-indigo-600",
  };

  const { name, type, host, port, file, date } = connection;

  return (
    <>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Data Source</h2>
      </div>
      <div className="pl-10">
        <div className="flex justify-between items-center ">
          <div>
            <h3 className="text-sm font-medium">
              {name || "Unnamed Connection"}
            </h3>
            {host && (
              <p className="text-xs text-gray-500">
                {host}:{port}
              </p>
            )}
            {file && <p className="text-xs text-gray-500">{file}</p>}
            <p className="text-xs text-gray-400">{date}</p>
          </div>
          <div className={`text-xs px-3 py-1 rounded ${typeColor[type]}`}>
            {type}
          </div>
        </div>
        <Link to="/">
          <button className="w-full mt-4 text-xs cursor-pointer btn-outline">
            Change Data Source
          </button>
        </Link>
      </div>
    </>
  );
};

export default DataSource;
