// @/components/QueryBuilder/main/manual/LimitSection.tsx
import React from "react";

interface LimitSectionProps {
  limit: string;
  setLimit: (limit: string) => void;
}

const LimitSection: React.FC<LimitSectionProps> = ({ limit, setLimit }) => {
  return (
    <div>
      <span className="font-semibold text-sm">LIMIT Rows</span>
      <input
        type="number"
        min={1}
        className="input"
        value={limit}
        onChange={(e) => {
          const value = e.target.value.trim();
          if (/^\d*$/.test(value)) setLimit(value); // only allow digits
        }}
        placeholder="e.g. 10"
      />
    </div>
  );
};

export default LimitSection;
