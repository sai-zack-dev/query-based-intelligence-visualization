import React, { useEffect, useState } from "react";
import { FaPlay, FaChartBar, FaTrashAlt } from "react-icons/fa";
import { QueryRecord } from "@/types/query";

const SavedQuery: React.FC = () => {
  const [queries, setQueries] = useState<QueryRecord[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  const handleUseQuery = (id: number) => {
    const selected = queries.find((q) => q.id === id);
    if (!selected) return;
    console.log("Use query:", selected);
    // TODO: auto-fill form builder or text editor
  };

  const handleDeleteQuery = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this query?");
    if (!confirmed) return;
    await window.ipcRenderer.invoke("delete-query", id);
    loadQueries();
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuery(query.id);
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

                    <div className="flex flex-col lg:flex-row items-center gap-2">
                      <button
                        onClick={() => handleUseQuery(query.id)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full"
                      >
                        <FaPlay className="w-3 h-3" />
                        <span className="text-xs">Use Query</span>
                      </button>
                      <button
                        onClick={() => handleDeleteQuery(query.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 border border-red-300 rounded-md hover:bg-red-200 transition-colors w-full"
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
    </>
  );
};

export default SavedQuery;
