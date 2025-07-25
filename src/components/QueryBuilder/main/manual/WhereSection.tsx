// @/components/QueryBuilder/main/manual/WhereSection.tsx
import React from "react";
import { FaCircleXmark } from "react-icons/fa6";
import type { Filter } from "@/types/querybuilder";

type WhereSectionProps = {
  filters: Filter[];
  setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  allColumns: string[];
};

const WhereSection: React.FC<WhereSectionProps> = ({
  filters,
  setFilters,
  allColumns,
}) => {
  const handleChange = (
    index: number,
    field: "column" | "operator" | "value",
    value: string
  ) => {
    setFilters((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  return (
    <div>
      <div className="flex justify-between">
        <span className="font-semibold text-sm">WHERE Filters</span>
        <button
          className="text-xs text-blue-500"
          onClick={() =>
            setFilters([...filters, { column: "", operator: "=", value: "" }])
          }
        >
          + Add WHERE Filter
        </button>
      </div>
      <div className="space-y-2 mt-2">
        {filters.map((f: Filter, i: number) => (
          <div
            key={i}
            className="flex gap-2 items-center border rounded-lg p-3 relative"
          >
            <select
              className="input"
              value={f.column}
              onChange={(e) => handleChange(i, "column", e.target.value)}
            >
              <option value="">-- Column --</option>
              {allColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={f.operator}
              onChange={(e) => handleChange(i, "operator", e.target.value)}
            >
              <option value="=">=</option>
              <option value="!=">!=</option>
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value="LIKE">LIKE</option>
            </select>
            <input
              type="text"
              placeholder="Enter value"
              className="input"
              value={f.value}
              onChange={(e) => handleChange(i, "value", e.target.value)}
            />
            <button
              className="text-red-500 absolute -right-2"
              onClick={() =>
                setFilters((prev: Filter[]) =>
                  prev.filter((_, idx: number) => idx !== i)
                )
              }
            >
              <FaCircleXmark className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhereSection;
