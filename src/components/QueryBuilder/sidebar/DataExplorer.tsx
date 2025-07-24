import React, { useEffect, useState } from "react";
import EntitySection from "./EntitySection";
import { useActiveConnection } from "@/hooks/useActiveConnection";
import { useQueryBuilderContext } from "@/context/QueryBuilderContext"; // ✅ Add

const DataExplorer: React.FC = () => {
  const {
    databases,
    fetchDatabases,
    fetchTables,
    loading,
    error,
  } = useActiveConnection();

  const { selectedDatabase, setSelectedDatabase } = useQueryBuilderContext(); // ✅ Use context

  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleDatabaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const db = e.target.value;
    if (db) {
      setSelectedDatabase(db); // ✅ updates context (and QueryTools)
      fetchTables(db);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Data Explorer</h2>
      </div>

      <div className="flex flex-col gap-4 pl-10">
        <form className="flex flex-col space-y-3">
          <div>
            <label className="input-label" htmlFor="database-select">
              Database
            </label>

            <select
              id="database-select"
              className="input"
              value={selectedDatabase ?? ""}
              onChange={handleDatabaseChange}
              disabled={loading.dbs}
            >
              <option value="">Select database</option>
              {databases.map((db) => (
                <option key={db} value={db}>
                  {db}
                </option>
              ))}
            </select>

            {loading.dbs && <p className="text-xs text-gray-500 mt-1">Loading databases…</p>}
            {error && <p className="text-xs text-red-500 mt-1">Error: {error}</p>}
          </div>
        </form>

        <EntitySection selectedDatabase={selectedDatabase} />
      </div>
    </>
  );
};

export default DataExplorer;
