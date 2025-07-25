// @/components/QueryBuilder/main/manual/JoinSection.tsx
import React from "react";
import { FaCircleXmark } from "react-icons/fa6";
import type { Join, JoinType } from "@/types/querybuilder";

type JoinSectionProps = {
  joins: Join[];
  setJoins: React.Dispatch<React.SetStateAction<Join[]>>;
  tables: string[];
  fetchSchema: (db: string, table: string) => void;
  selectedDatabase: string;
  allColumns: string[];
};

const JoinSection: React.FC<JoinSectionProps> = ({
  joins,
  setJoins,
  tables,
  allColumns,
  selectedDatabase,
  fetchSchema,
}) => {
  const joinTypes: JoinType[] = [
    "JOIN",
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
  ];

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-semibold text-sm">JOIN Tables</span>
        <button
          className="text-xs text-blue-500"
          onClick={() =>
            setJoins([
              ...joins,
              {
                type: "INNER JOIN",
                table: "",
                on: { left: "", operator: "=", right: "" },
              },
            ])
          }
        >
          + Add JOIN Table
        </button>
      </div>
      {joins.map((join, idx) => (
        <div
          key={idx}
          className="mt-2 border rounded-lg p-3 space-y-3 relative"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={join.type}
              onChange={(e) => {
                const updated = [...joins];
                updated[idx].type = e.target.value as JoinType;

                setJoins(updated);
              }}
              className="input"
            >
              {joinTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={join.table}
              onChange={async (e) => {
                const updated = [...joins];
                updated[idx].table = e.target.value;
                setJoins(updated);
                if (selectedDatabase && e.target.value) {
                  await fetchSchema(selectedDatabase, e.target.value);
                }
              }}
              className="input"
            >
              <option value="">-- Select Table --</option>
              {tables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={join.on.left}
              onChange={(e) => {
                const updated = [...joins];
                updated[idx].on.left = e.target.value;
                setJoins(updated);
              }}
              className="input"
            >
              <option value="">-- Left Column --</option>
              {allColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <span>=</span>
            <select
              value={join.on.right}
              onChange={(e) => {
                const updated = [...joins];
                updated[idx].on.right = e.target.value;
                setJoins(updated);
              }}
              className="input"
            >
              <option value="">-- Right Column --</option>
              {allColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <button
            className="text-red-500 cursor-pointer absolute -top-2 -right-2"
            onClick={() => setJoins((prev) => prev.filter((_, i) => i !== idx))}
          >
            <FaCircleXmark className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default JoinSection;
