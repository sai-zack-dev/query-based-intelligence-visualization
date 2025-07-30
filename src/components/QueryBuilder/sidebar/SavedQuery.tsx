import React, { useEffect, useState } from "react";
import { FaPlay, FaTrashAlt } from "react-icons/fa";
import { QueryRecord } from "@/types/query";
import { useQueryBuilderContext } from "@/context/QueryBuilderContext";
import type {
  Filter,
  Join,
  JoinType,
  operatorType,
  OrderByItem,
} from "@/types/querybuilder";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const SavedQuery: React.FC = () => {
  const [queries, setQueries] = useState<QueryRecord[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { setManualForm, setJoins } = useQueryBuilderContext();

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    const result = await window.ipcRenderer.invoke("get-saved-queries");
    setQueries(result);
  };

  const toggleExpanded = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const parseSimpleSQL = (query: string) => {
    const result: {
      table: string;
      columns: string[];
      filters?: Filter[];
      limit?: number;
      joins?: Join[];
      groupBy?: string[];
      orderBy?: OrderByItem[];
    } = {
      table: "",
      columns: [],
    };

    const selectMatch = query.match(/SELECT\s+(.*?)\s+FROM/i);
    const fromMatch = query.match(/FROM\s+([^\s;]+)/i);
    const whereMatch = query.match(/WHERE\s+(.*?)(GROUP BY|ORDER BY|LIMIT|$)/i);
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    const groupByMatch = query.match(/GROUP BY\s+(.*?)(ORDER BY|LIMIT|$)/i);
    const orderByMatch = query.match(/ORDER BY\s+(.*?)(LIMIT|$)/i);
    const joinRegex =
      /((LEFT|RIGHT|INNER)?\s*JOIN)\s+(\w+)\s+ON\s+([^\s]+)\s*([=<>!]+)\s*([^\s]+)/gi;

    if (selectMatch) {
      const colsRaw = selectMatch[1].trim();
      result.columns =
        colsRaw === "*" ? ["*"] : colsRaw.split(",").map((c) => c.trim());
    }

    if (fromMatch) result.table = fromMatch[1].trim();
    if (limitMatch) result.limit = Number(limitMatch[1].trim());

    if (whereMatch) {
      const conditions = whereMatch[1].split("AND").map((c) => c.trim());
      result.filters = conditions
        .map((cond) => {
          const parts = cond.match(
            /^(.+?)\s*(=|!=|>|<|LIKE)\s*['"]?(.*?)['"]?$/i
          );
          if (!parts) return null;
          return {
            column: parts[1].trim(),
            operator: parts[2].trim() as any,
            value: parts[3].trim(),
          };
        })
        .filter(Boolean) as Filter[];
    }

    if (groupByMatch) {
      result.groupBy = groupByMatch[1].split(",").map((s) => s.trim());
    }

    if (orderByMatch) {
      result.orderBy = orderByMatch[1].split(",").map((s) => {
        const [col, dir] = s.trim().split(/\s+/);
        return {
          column: col,
          direction: dir?.toUpperCase() === "DESC" ? "DESC" : "ASC",
        };
      });
    }

    result.joins = [];
    let joinMatch: RegExpExecArray | null;
    while ((joinMatch = joinRegex.exec(query)) !== null) {
      result.joins.push({
        type: joinMatch[1]?.toUpperCase() as JoinType,
        table: joinMatch[3],
        on: {
          left: joinMatch[4],
          operator: joinMatch[5] as operatorType,
          right: joinMatch[6],
        },
      });
    }

    return result;
  };

  const handleUseQuery = (id: number) => {
    const selected = queries.find((q) => q.id === id);
    if (!selected) return;

    const parsed = parseSimpleSQL(selected.sql);

    if (parsed && parsed.table) {
      setManualForm({
        table: parsed.table,
        columns: parsed.columns ?? [],
        filters: parsed.filters ?? [],
        joins: parsed.joins ?? [],
        groupBy: parsed.groupBy ?? [],
        orderBy: parsed.orderBy ?? [],
        limit: Number(parsed.limit),
      });
      setJoins(parsed.joins ?? []);
    } else {
      alert("Unable to parse this query.");
    }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const requestDeleteQuery = (id: number) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (pendingDeleteId !== null) {
      await window.ipcRenderer.invoke("delete-query", pendingDeleteId);
      loadQueries();
      setPendingDeleteId(null);
      setConfirmOpen(false);
    }
  };

  const formatSQL = (sql: string) => {
    const keywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "GROUP BY",
      "ORDER BY",
      "JOIN",
      "ON",
      "SUM",
      "COUNT",
      "DATE",
      "NOW",
      "INTERVAL",
      "MONTH",
      "DESC",
      "ASC",
    ];
    let formatted = sql;

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      formatted = formatted.replace(
        regex,
        `<span class="text-green-400 font-semibold">${keyword}</span>`
      );
    });

    formatted = formatted.replace(
      /'([^']*)'/g,
      `<span class="text-yellow-300">'$1'</span>`
    );

    return formatted;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Saved Queries</h2>
      </div>

      <div className="space-y-4 pl-10">
        {queries.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-10">
            <p className="italic">No saved queries found.</p>
            <p className="mt-1 text-xs text-gray-400">
              Try saving a query from the builder.
            </p>
          </div>
        ) : (
          queries.map((query) => {
            const isExpanded = expandedId === query.id;

            return (
              <div
                key={query.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div
                  className={`p-3 cursor-pointer transition-colors ${
                    isExpanded
                      ? "bg-blue-50 border-b border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleExpanded(query.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {query.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {query.description}
                      </p>
                    </div>

                    {!isExpanded && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseQuery(query.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors cursor-pointer"
                          title="Use Query"
                        >
                          <FaPlay className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            requestDeleteQuery(query.id);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
                          title="Delete Query"
                        >
                          <FaTrashAlt className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 bg-blue-50">
                    <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
                      <pre className="text-xs text-white font-mono">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: formatSQL(query.sql),
                          }}
                        />
                      </pre>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-2">
                      <button
                        onClick={() => handleUseQuery(query.id)}
                        className="btn-primary w-full flex items-center gap-2 justify-center"
                      >
                        <FaPlay className="w-3 h-3" />
                        <span className="text-xs">Use Query</span>
                      </button>
                      <button
                        onClick={() => requestDeleteQuery(query.id)}
                        className="btn-outline-danger w-full flex items-center justify-center gap-2"
                      >
                        <FaTrashAlt className="w-4 h-4" />
                        <span className="text-xs">Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmOpen(false)}
        title="Delete Saved Query?"
        description="This will permanently remove the query. Are you sure?"
      />
    </>
  );
};

export default SavedQuery;
