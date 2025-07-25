// @/components/QueryBuilder/main/manual/GroupBySection.tsx
import React from "react";

interface GroupBySectionProps {
  groupBy: string[];
  setGroupBy: (groupBy: string[]) => void;
  groupableOptions: string[];
}

const GroupBySection: React.FC<GroupBySectionProps> = ({
  groupBy,
  setGroupBy,
  groupableOptions,
}) => {
  return (
    <div>
      <span className="font-semibold text-sm">GROUP BY</span>
      <select
        className="input w-full mt-1"
        value=""
        onChange={(e) => {
          const val = e.target.value;
          if (val && !groupBy.includes(val)) setGroupBy([...groupBy, val]);
        }}
      >
        <option value="">-- Select Column or Alias --</option>
        {groupableOptions.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2 mt-2">
        {groupBy.map((col) => (
          <span key={col} className="bg-blue-100 text-xs px-2 py-1 rounded">
            {col}
            <button
              className="ml-1 text-red-500"
              onClick={() => setGroupBy(groupBy.filter((c) => c !== col))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default GroupBySection;
