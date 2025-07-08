import React from "react";
import { ConnectionType } from "@/types/connection";

interface Props {
  connectionType: ConnectionType;
  onTypeChange: (type: ConnectionType) => void;
}

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
        <option value="">Select connection type</option>
        <option value="mysql">MySQL</option>
        <option value="excel">Excel</option>
        <option value="csv">CSV</option>
        <option value="sqlite">SQLite</option>
      </select>
    </div>
  );
};