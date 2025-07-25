import { useEffect, useState } from "react";
import { useActiveConnection } from "@/hooks/useActiveConnection";
import { FaCircleXmark } from "react-icons/fa6";
import { useRunQuery } from "@/hooks/useRunQuery";
import { FaChartArea } from "react-icons/fa";
interface ManualPanelProps {
  selectedDatabase: string | null;
}

export const ManualPanel: React.FC<ManualPanelProps> = ({
  selectedDatabase,
}) => {
  const {
    runQuery,
    result: queryResult,
    loading: queryLoading,
    error: queryError,
  } = useRunQuery();
  const [selectAll, setSelectAll] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [fromTable, setFromTable] = useState("");
  const [joins, setJoins] = useState<
    {
      type: string;
      table: string;
      on: { left: string; operator: string; right: string };
    }[]
  >([]);
  const [filters, setFilters] = useState<
    { column: string; operator: string; value: string }[]
  >([]);
  const [limit, setLimit] = useState("");

  const { fetchTables, fetchSchema, tables, schema, loading, error } =
    useActiveConnection();

  useEffect(() => {
    if (selectedDatabase) {
      fetchTables(selectedDatabase);
    }
  }, [selectedDatabase]);

  useEffect(() => {
    if (fromTable && selectedDatabase) {
      fetchSchema(selectedDatabase, fromTable);
    }
  }, [fromTable]);

  // Combine columns from FROM + JOIN tables
  const allColumns: string[] = selectedDatabase
    ? [
        ...(fromTable && schema?.[selectedDatabase]?.[fromTable]
          ? schema[selectedDatabase][fromTable].map(
              (f) => `${fromTable}.${f.Field}`
            )
          : []),
        ...joins.flatMap((join) =>
          schema?.[selectedDatabase]?.[join.table]
            ? schema[selectedDatabase][join.table].map(
                (f) => `${join.table}.${f.Field}`
              )
            : []
        ),
      ]
    : [];

  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleFilterChange = (
    index: number,
    field: "column" | "operator" | "value",
    value: string
  ) => {
    setFilters((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
    );
  };

  const generateSQL = (): string => {
    const cols = selectAll
      ? "*"
      : selectedColumns.length > 0
      ? selectedColumns.join(", ")
      : "*";

    let sql = `SELECT ${cols} FROM ${fromTable}`;

    for (const join of joins) {
      if (join.type && join.table && join.on.left && join.on.right) {
        sql += ` ${join.type} ${join.table} ON ${join.on.left} ${join.on.operator} ${join.on.right}`;
      }
    }

    if (filters.length > 0) {
      const whereClauses = filters
        .filter((f) => f.column && f.operator && f.value)
        .map((f) => `${f.column} ${f.operator} '${f.value}'`);
      if (whereClauses.length > 0) {
        sql += ` WHERE ${whereClauses.join(" AND ")}`;
      }
    }

    if (limit && /^\d+$/.test(limit.trim())) {
      sql += ` LIMIT ${limit.trim()}`;
    }

    return sql + ";";
  };

  return (
    <div className="space-y-5 mt-4">
      {/* SELECT Columns */}
      <div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-sm">SELECT Columns</span>
          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              id="all"
              checked={selectAll}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectAll(checked);
                setSelectedColumns(checked ? allColumns : []);
              }}
            />
            <label htmlFor="all">All Columns (*)</label>
          </div>
        </div>
        {!selectAll && fromTable && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 mt-2 border rounded-lg p-3 max-h-50 overflow-y-auto overflow-x-hidden">
            {allColumns.map((col) => (
              <label
                key={col}
                className="grid grid-cols-2 items-center gap-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(col)}
                    onChange={() => toggleColumn(col)}
                  />
                  <span className="truncate" title={col}>
                    {col}
                  </span>
                </div>
                <input
                  placeholder="Alias (Optional)"
                  className="text-xs input"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* FROM Table */}
      <div>
        <span className="font-semibold text-sm">FROM Table (Primary)</span>
        {loading.tables ? (
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

      {/* JOIN Tables */}
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
                  updated[idx].type = e.target.value;
                  setJoins(updated);
                }}
                className="input"
              >
                <option value="INNER JOIN">INNER JOIN</option>
                <option value="LEFT JOIN">LEFT JOIN</option>
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
              onClick={() =>
                setJoins((prev) => prev.filter((_, i) => i !== idx))
              }
            >
              <FaCircleXmark className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* WHERE Filters */}
      <div>
        <div className="flex justify-between">
          <span className="font-semibold text-sm">WHERE Filters</span>
          <button
            className="text-xs text-blue-500"
            onClick={() =>
              setFilters([...filters, { column: "", operator: "=", value: "" }])
            }
          >
            + Add WHERE Filters
          </button>
        </div>
        <div className="space-y-2 mt-2">
          {filters.map((f, i) => (
            <div
              key={i}
              className="flex gap-2 items-center border rounded-lg p-3 relative"
            >
              <select
                className="input"
                value={f.column}
                onChange={(e) =>
                  handleFilterChange(i, "column", e.target.value)
                }
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
                onChange={(e) =>
                  handleFilterChange(i, "operator", e.target.value)
                }
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
                onChange={(e) => handleFilterChange(i, "value", e.target.value)}
              />
              <button
                className="text-red-500 absolute -right-2"
                onClick={() =>
                  setFilters((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <FaCircleXmark className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* LIMIT */}
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

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          className="btn-primary text-xs"
          disabled={loading.tables || loading.schema}
          onClick={() => runQuery(selectedDatabase, generateSQL())}
        >
          ▶ Run Query
        </button>
        <div className="flex gap-3">
          {/* <button className="btn-outline text-xs">Export As</button> */}
          <button className="btn-outline text-xs flex gap-2">
            <FaChartArea className="w-4 h-4" />
            Generate Chart</button>
        </div>
      </div>
      <div>
        {queryLoading && (
          <p className="text-sm text-gray-500">Running query…</p>
        )}
        {queryError && (
          <p className="text-sm text-red-500">Error: {queryError}</p>
        )}
        {queryResult && queryResult.length > 0 && (
          <div className="border rounded-lg mt-2 overflow-x-auto">
            <table className="text-sm w-full">
              <thead className="bg-blue-100 text-left">
                <tr>
                  {Object.keys(queryResult[0]).map((col) => (
                    <th key={col} className="px-3 py-2 border-b font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResult.map((row, i) => (
                  <tr key={i} className="border-t">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-3 py-2 border-b truncate">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {queryResult && queryResult.length === 0 && (
          <p className="text-sm text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
};
