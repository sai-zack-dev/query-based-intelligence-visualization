import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActiveConnection } from "@/hooks/useActiveConnection";
import { useRunQuery } from "@/hooks/useRunQuery";
import SelectSection from "@/components/QueryBuilder/main/manual/SelectSection";
import FromSection from "@/components/QueryBuilder/main/manual/FromSection";
import JoinSection from "@/components/QueryBuilder/main/manual/JoinSection";
import WhereSection from "@/components/QueryBuilder/main/manual/WhereSection";
import GroupBySection from "@/components/QueryBuilder/main/manual/GroupBySection";
import OrderBySection from "@/components/QueryBuilder/main/manual/OrderBySection";
import LimitSection from "@/components/QueryBuilder/main/manual/LimitSection";
import ActionButtons from "@/components/QueryBuilder/main/manual/ActionButtons";
import ResultSection from "@/components/QueryBuilder/main/manual/ResultSection";
import {
  ColumnSelection,
  Join,
  Filter,
  OrderByItem,
} from "@/types/querybuilder";

interface ManualPanelProps {
  selectedDatabase: string | null;
}

export const ManualPanel: React.FC<ManualPanelProps> = ({
  selectedDatabase,
}) => {
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [columnSelections, setColumnSelections] = useState<ColumnSelection[]>(
    []
  );
  const [fromTable, setFromTable] = useState<string>("");
  const [joins, setJoins] = useState<Join[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<OrderByItem[]>([]);
  const [limit, setLimit] = useState<string>("");
  const groupableOptions = columnSelections.map((c) => c.alias || c.name);
  const orderableOptions = columnSelections.map((col) => col.alias || col.name);

  const { fetchTables, fetchSchema, tables, schema, loading } =
    useActiveConnection();
  const { runQuery, result, loading: queryLoading, error } = useRunQuery();

  useEffect(() => {
    if (selectedDatabase) fetchTables(selectedDatabase);
  }, [selectedDatabase]);

  useEffect(() => {
    if (fromTable && selectedDatabase) fetchSchema(selectedDatabase, fromTable);
  }, [fromTable]);

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

  const generateSQL = (): string => {
    const aliasMap: Record<string, string> = {};
    const cols = selectAll
      ? "*"
      : columnSelections
          .map((col) => {
            let expr = col.name;
            if (col.func === "COUNT") expr = `COUNT(${col.name})`;
            else if (col.func === "SUM") expr = `SUM(${col.name})`;
            else if (col.func === "DATE_FORMAT") {
              expr = `DATE_FORMAT(${col.name}, '${col.format || "%Y-%m-%d"}')`;
            }
            if (col.alias) {
              aliasMap[col.alias] = expr;
              expr += ` AS ${col.alias}`;
            }
            return expr;
          })
          .join(", ");

    const groupByFields = groupBy.map((col) => aliasMap[col] || col);
    const orderByFields = orderBy.map(
      (item) => `${aliasMap[item.column] || item.column} ${item.direction}`
    );

    let sql = `SELECT ${cols} FROM ${fromTable}`;
    joins.forEach((join) => {
      sql += ` ${join.type} ${join.table} ON ${join.on.left} ${join.on.operator} ${join.on.right}`;
    });
    const where = filters
      .filter((f) => f.column && f.operator && f.value)
      .map((f) => `${f.column} ${f.operator} '${f.value}'`)
      .join(" AND ");
    if (where) sql += ` WHERE ${where}`;
    if (groupByFields.length) sql += ` GROUP BY ${groupByFields.join(", ")}`;
    if (orderByFields.length) sql += ` ORDER BY ${orderByFields.join(", ")}`;
    if (limit && /^\d+$/.test(limit.trim())) sql += ` LIMIT ${limit.trim()}`;

    return sql + ";";
  };
  // Add this in ManualPanel.tsx, below useState
  const toggleColumn = (col: string) => {
    setColumnSelections((prev) => {
      const exists = prev.find((c) => c.name === col);
      if (exists) return prev.filter((c) => c.name !== col);
      return [...prev, { name: col, func: "", alias: "" }];
    });
  };

  const updateColumn = (
    col: string,
    key: keyof ColumnSelection,
    value: string
  ) => {
    setColumnSelections((prev) =>
      prev.map((c) => (c.name === col ? { ...c, [key]: value } : c))
    );
  };

  const handleRunQuery = () => {
    if (!selectedDatabase) return;
    const sql = generateSQL();
    runQuery(selectedDatabase, sql);
  };

  return (
    <div className="space-y-5 mt-4">
      <SelectSection
        {...{
          selectAll,
          setSelectAll,
          columnSelections,
          setColumnSelections,
          allColumns,
          toggleColumn,
          updateColumn,
        }}
      />
      <FromSection
        {...{ fromTable, setFromTable, tables, loading: loading.tables }}
      />
      <JoinSection
        joins={joins}
        setJoins={setJoins}
        tables={tables}
        fetchSchema={fetchSchema}
        selectedDatabase={selectedDatabase || ""}
        allColumns={allColumns}
      />
      <WhereSection {...{ filters, setFilters, allColumns }} />
      <GroupBySection
        {...{ groupBy, setGroupBy, columnSelections, groupableOptions }}
      />
      <OrderBySection
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        orderableOptions={orderableOptions} // ✅ fixed
      />
      <LimitSection {...{ limit, setLimit }} />
      <ActionButtons
        disabled={queryLoading || loading.tables || loading.schema}
        onRun={handleRunQuery}
        resultData={result ?? undefined}
      />
      <ResultSection
        loading={queryLoading}
        error={error}
        data={result ?? undefined}
      />
    </div>
  );
};
