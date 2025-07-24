import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useActiveConnection } from "@/hooks/useActiveConnection";
import { ConnectionType } from "@/types/connection";

const typeColor: Record<string, string> = {
  mysql: "bg-teal-100 text-teal-600",
  sqlite: "bg-blue-100 text-blue-600",
  excel: "bg-green-100 text-green-600",
  csv: "bg-indigo-100 text-indigo-600",
};

const DataSource: React.FC = () => {
  const { meta, loading, error, fetchMeta } = useActiveConnection();

  useEffect(() => {
    fetchMeta();
  }, []);

  // 🟥 No connection fallback
  if (loading.meta) {
    return (
      <div className="pl-6 py-6 text-sm text-gray-500">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="pl-6 py-6 text-sm text-red-500">Error: {error}</div>
    );
  }

  if (!meta) {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
          <h2 className="font-semibold text-gray-800">Data Source</h2>
        </div>

        {/* No Connection State */}
        <div className="pl-6">
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 mb-4">
              No data source connected
            </p>
            <Link to="/">
              <button className="btn-outline text-xs">
                Connect Data Source
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Destructure and provide fallback for nullables
  const {
    name = "Unnamed Connection",
    type,
    host,
    port,
    file,
    lastUpdate,
  } = meta;

  return (
    <div className="px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Data Source</h2>
      </div>

      {/* Info Section */}
      <div className="pl-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-800">{name}</h3>

            {/* Connection location */}
            {host && port !== null && (
              <p className="text-xs text-gray-500">
                {host}:{port}
              </p>
            )}

            {/* File path for local sources */}
            {file && (
              <p className="text-xs text-gray-500 truncate max-w-[260px]">
                {file}
              </p>
            )}

            {/* Connection date */}
            {lastUpdate && (
              <p className="text-xs text-gray-400">
                Connected on {new Date(lastUpdate).toLocaleString()}
              </p>
            )}
          </div>

          {/* Type Tag */}
          <div
            className={`text-xs px-3 py-1 rounded ${
              typeColor[type?.toLowerCase()] || "bg-gray-100 text-gray-600"
            }`}
          >
            {type}
          </div>
        </div>

        {/* Change Button */}
        <Link to="/">
          <button className="w-full mt-4 text-xs py-1.5 border border-blue-400 text-blue-500 rounded-md hover:bg-blue-50 transition">
            Change Data Source
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DataSource;
