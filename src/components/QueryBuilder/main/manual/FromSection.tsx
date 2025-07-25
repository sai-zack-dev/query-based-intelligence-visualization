// @/components/QueryBuilder/main/manual/FromSection.tsx
import React from "react";

interface FromSectionProps {
  tables: string[];
  fromTable: string;
  setFromTable: (val: string) => void;
  loading: boolean;
}

const FromSection: React.FC<FromSectionProps> = ({
  tables,
  fromTable,
  setFromTable,
  loading,
}) => {
  return (
    <div>
      <span className="font-semibold text-sm">FROM Table (Primary)</span>
      {loading ? (
        <p className="text-xs text-gray-500 mt-1">Loading tables…</p>
      ) : (
        <select
          className="w-full mt-1 border px-3 py-2 rounded"
          value={fromTable}
          onChange={(e) => setFromTable(e.target.value)}
        >
          <option value="">-- Select Table --</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default FromSection;
