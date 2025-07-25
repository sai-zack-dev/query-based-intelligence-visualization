// @/components/QueryBuilder/main/manual/SelectSection.tsx
import React from "react";

type ColumnSelection = {
  name: string;
  func: "" | "COUNT" | "SUM" | "DATE_FORMAT";
  alias: string;
  format?: string;
};

interface SelectSectionProps {
  selectAll: boolean;
  setSelectAll: (val: boolean) => void;
  allColumns: string[];
  columnSelections: ColumnSelection[];
  toggleColumn: (col: string) => void;
  updateColumn: (col: string, key: keyof ColumnSelection, value: string) => void;
}

const SelectSection: React.FC<SelectSectionProps> = ({
  selectAll,
  setSelectAll,
  allColumns,
  columnSelections,
  toggleColumn,
  updateColumn,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm">SELECT Columns</span>
        <div className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            id="all"
            checked={selectAll}
            onChange={(e) => {
              setSelectAll(e.target.checked);
            }}
          />
          <label htmlFor="all">All Columns (*)</label>
        </div>
      </div>
      {!selectAll && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mt-2 border rounded-lg p-3 max-h-50 overflow-y-auto">
          {allColumns.map((col) => {
            const selected = columnSelections.find((c) => c.name === col);
            return (
              <div key={col} className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => toggleColumn(col)}
                  />
                  <span className="truncate" title={col}>
                    {col}
                  </span>
                </label>
                {selected && (
                  <div className="flex gap-2">
                    <select
                      className="text-xs input"
                      value={selected.func}
                      onChange={(e) =>
                        updateColumn(col, "func", e.target.value)
                      }
                    >
                      <option value="">(None)</option>
                      <option value="COUNT">COUNT</option>
                      <option value="SUM">SUM</option>
                      <option value="DATE_FORMAT">DATE_FORMAT</option>
                    </select>
                    {selected.func === "DATE_FORMAT" && (
                      <input
                        placeholder="%Y-%m-%d"
                        className="text-xs input"
                        value={selected.format || ""}
                        onChange={(e) =>
                          updateColumn(col, "format", e.target.value)
                        }
                      />
                    )}
                    <input
                      placeholder="Alias"
                      className="text-xs input"
                      value={selected.alias}
                      onChange={(e) =>
                        updateColumn(col, "alias", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectSection;
