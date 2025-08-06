import React from "react";
import { ConnectionType } from "@/types/connection";

interface Props {
  connectionType: ConnectionType;
  onTypeChange: (type: ConnectionType) => void;
}

// For now, only show MySQL; later add others by uncommenting or expanding
const options: { label: string; value: ConnectionType | "" }[] = [
  { label: "Select connection type", value: "" },
  { label: "MySQL", value: "mysql" },
  { label: "Excel", value: "excel" },
  // { label: "CSV", value: "csv" },
  { label: "SQLite", value: "sqlite" },
];

export const ConnectionTypeSelector: React.FC<Props> = ({
  connectionType,
  onTypeChange,
}) => {
  return (
    <div>
      <label className="input-label">Connection Type</label>
      <select
        className="input"
        value={connectionType}
        onChange={(e) => onTypeChange(e.target.value as ConnectionType)}
      >
        {options.map((option) => (
          <option key={option.value || "default"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
