import React, { useState } from "react";
import { FaPlay, FaChartBar, FaTrashAlt } from "react-icons/fa";
import { SAVED_QUERIES } from "@/mock/MockData";
import { QueryOption } from "@/types/query";

const SavedQuery: React.FC = () => {
  const [queries, setQueries] = useState<QueryOption[]>(SAVED_QUERIES);

  const toggleExpanded = (id: string) => {
    setQueries(
      queries.map((query) =>
        query.id === id ? { ...query, expanded: !query.expanded } : query
      )
    );
  };

  const handleRunQuery = (id: string) => {
    console.log(`Running query ${id}`);
  };

  const handleGenerateChart = (id: string) => {
    console.log(`Generating chart for query ${id}`);
  };

  const handleDeleteQuery = (id: string) => {
    setQueries(queries.filter((query) => query.id !== id));
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

    // Color strings
    formatted = formatted.replace(
      /'([^']*)'/g,
      `<span class="text-yellow-300">'$1'</span>`
    );

    return formatted;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Saved Query</h2>
      </div>

      <div className="space-y-4 pl-10">
        {queries.map((query) => (
          <div
            key={query.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div
              className={`p-3 cursor-pointer transition-colors ${
                query.expanded
                  ? "bg-blue-50 border-b border-blue-200"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => toggleExpanded(query.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {query.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {query.description}
                    </p>
                  </div>
                </div>

                {/* Action buttons - only show when not expanded */}
                {!query.expanded && (
                  <div className="flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunQuery(query.id);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                      title="Run Query"
                    >
                      <FaPlay className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateChart(query.id);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                      title="Generate Chart"
                    >
                      <FaChartBar className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteQuery(query.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete Query"
                    >
                      <FaTrashAlt className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {query.expanded && (
              <div className="p-4 bg-blue-50">
                {/* SQL Code Block */}
                <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
                  <pre className="text-xs text-white font-mono">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: formatSQL(query.query),
                      }}
                    />
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col lg:flex-row items-center gap-2">
                  <button
                    onClick={() => handleRunQuery(query.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg lg:justify-center hover:bg-blue-700 transition-colors w-full lg:flex-2/5 flex-grow"
                  >
                    <FaPlay className="w-3 h-3" />
                    <span className="text-xs">Run Query</span>
                  </button>

                  <button
                    onClick={() => handleGenerateChart(query.id)}
                    className="flex items-center space-x-2 px-4 py-2 lg:justify-center bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors w-full lg:flex-2/5 h-full"
                  >
                    <FaChartBar className="w-4 h-4" />
                    <span className="text-xs">Build Chart</span>
                  </button>

                  <button
                    onClick={() => handleDeleteQuery(query.id)}
                    className="flex items-center lg:justify-center gap-2 h-full px-4 py-2 lg:py-4 xl:py-2 bg-red-100 text-red-600 border border-red-300 rounded-lg hover:bg-red-200 transition-colors w-full lg:flex-1/5"
                    title="Delete Query"
                  >
                    <FaTrashAlt className="w-4 h-4" />
                    <span className="text-xs lg:hidden">Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SavedQuery;
