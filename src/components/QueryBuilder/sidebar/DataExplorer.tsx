import React from "react";
import EntitySection from "./EntitySection";
import { DatabaseOption } from "../../../types/database";

interface DataExplorerProps {
  selectedDatabase?: string;
  onDatabaseChange?: (database: string) => void;
  databases: DatabaseOption[];
}

const DataExplorer: React.FC<DataExplorerProps> = ({
  selectedDatabase = "",
  onDatabaseChange,
  databases,
}) => {
  const handleDatabaseChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    onDatabaseChange?.(value);
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
              value={selectedDatabase}
              onChange={handleDatabaseChange}
            >
              <option value="">Select database</option>
              {databases.map((db) => (
                <option key={db.value} value={db.value}>
                  {db.label}
                </option>
              ))}
            </select>
          </div>
        </form>
        <EntitySection />
      </div>
    </>
  );
};

export default DataExplorer;
