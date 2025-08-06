import { useEffect, useState } from "react";
import {
  ColumnSelection,
  Filter,
  OrderByItem,
} from "@/types/querybuilder";
import { useQueryBuilderContext } from "@/context/QueryBuilderContext";
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

interface ManualPanelProps {
  selectedDatabase: string | null;
}

export const ManualPanel: React.FC<ManualPanelProps> = ({ selectedDatabase }) => {
  const {
    setSql,
    manualForm,
    setManualForm,
    joins,
    setJoins,
    tables,
    schema,
    loading,
  } = useQueryBuilderContext();

  const { runQuery, result, loading: queryLoading, error } = useRunQuery();

  const [selectAll, setSelectAll] = useState<boolean>(true);
  const [columnSelections, setColumnSelections] = useState<ColumnSelection[]>([]);
  const [fromTable, setFromTable] = useState<string>("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<OrderByItem[]>([]);
  const [limit, setLimit] = useState<number>();

  const groupableOptions = columnSelections.map((c) => c.alias || c.name);
  const orderableOptions = columnSelections.map((c) => c.alias || c.name);

  useEffect(() => {
    if (manualForm) {
      setFromTable(manualForm.table);
      setSelectAll(manualForm.columns.includes("*"));
      setColumnSelections(
        manualForm.columns.includes("*")
          ? []
          : manualForm.columns.map((raw) => {
              const aliasMatch = raw.match(/\s+AS\s+(.+)$/i);
              const alias = aliasMatch ? aliasMatch[1].trim() : "";
              const expr = aliasMatch ? raw.replace(/\s+AS\s+.+$/i, "") : raw;

              let func: "" | "COUNT" | "SUM" | "DATE_FORMAT" = "";
              let name = expr;
              let format: string | undefined;

              if (/^COUNT\(.+\)$/i.test(expr)) {
                func = "COUNT";
                name = expr.match(/^COUNT\((.+)\)$/i)?.[1].trim() || expr;
              } else if (/^SUM\(.+\)$/i.test(expr)) {
                func = "SUM";
                name = expr.match(/^SUM\((.+)\)$/i)?.[1].trim() || expr;
              } else if (/^DATE_FORMAT\(.+?,\s*'(.+?)'\)/i.test(expr)) {
                func = "DATE_FORMAT";
                const match = expr.match(/^DATE_FORMAT\((.+?),\s*'(.+?)'\)/i);
                name = match?.[1].trim() || expr;
                format = match?.[2];
              }

              return { name: name.trim(), func, alias, format };
            })
      );
      if (manualForm.filters) setFilters(manualForm.filters);
      if (manualForm.limit) setLimit(Number(manualForm.limit));
      if (manualForm.groupBy) setGroupBy(manualForm.groupBy);
      if (manualForm.orderBy) setOrderBy(manualForm.orderBy);
      if (manualForm.joins) setJoins(manualForm.joins);

      setManualForm(null);
    }
  }, [manualForm]);

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
      (item) => `${item.column} ${item.direction}`
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
    if (limit) sql += ` LIMIT ${limit}`;

    return sql + ";";
  };

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
    setSql(sql);
    console.log("Running query:", sql);
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
        {...{ fromTable, setFromTable, tables, loading: loading.dbs || tables.length === 0 }}
      />
      <JoinSection
        joins={joins}
        setJoins={setJoins}
        tables={tables}
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
        orderableOptions={orderableOptions}
      />
      <LimitSection {...{ limit, setLimit }} />
      <ActionButtons
        disabled={queryLoading}
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
