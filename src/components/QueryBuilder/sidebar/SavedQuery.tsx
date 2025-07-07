import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaPlay, FaChartBar, FaTrashAlt } from 'react-icons/fa';


interface SavedQuery {
  id: string;
  title: string;
  description: string;
  query: string;
  expanded?: boolean;
}

const SavedQueriesAccordion: React.FC = () => {
  const [queries, setQueries] = useState<SavedQuery[]>([
    {
      id: '1',
      title: 'Untitled_query.sql',
      description: 'The query is about list of all the customers from singapore',
      query: `SELECT * FROM customers
WHERE country = 'singapore';`,
      expanded: true
    },
    {
      id: '2',
      title: 'Sales_query.sql',
      description: 'The query is about sales of the last month',
      query: `SELECT SUM(amount) as total_sales, DATE(created_at) as sale_date
FROM sales 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;`,
      expanded: false
    },
    {
      id: '3',
      title: 'Sales_query2.sql',
      description: 'The query is about sales of the this month',
      query: `SELECT SUM(amount) as total_sales, product_name
FROM sales s
JOIN products p ON s.product_id = p.id
WHERE MONTH(s.created_at) = MONTH(NOW())
GROUP BY product_name
ORDER BY total_sales DESC;`,
      expanded: false
    }
  ]);

  const toggleExpanded = (id: string) => {
    setQueries(queries.map(query => 
      query.id === id ? { ...query, expanded: !query.expanded } : query
    ));
  };

  const handleRunQuery = (id: string) => {
    console.log(`Running query ${id}`);
  };

  const handleGenerateChart = (id: string) => {
    console.log(`Generating chart for query ${id}`);
  };

  const handleDeleteQuery = (id: string) => {
    setQueries(queries.filter(query => query.id !== id));
  };

  const formatSQL = (sql: string) => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'JOIN', 'ON', 'SUM', 'DATE', 'NOW', 'INTERVAL', 'MONTH', 'DESC', 'ASC'];
    let formatted = sql;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `<span class="text-green-400 font-semibold">${keyword}</span>`);
    });
    
    // Color strings
    formatted = formatted.replace(/'([^']*)'/g, `<span class="text-yellow-300">'$1'</span>`);
    
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
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div
              className={`p-3 cursor-pointer transition-colors ${
                query.expanded ? 'bg-blue-50 border-b border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleExpanded(query.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{query.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{query.description}</p>
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
                      <FaPlay className="w-3 h-3"/>
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
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <pre className="text-xs text-white font-mono overflow-x-auto">
                    <code 
                      dangerouslySetInnerHTML={{ 
                        __html: formatSQL(query.query) 
                      }}
                    />
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleRunQuery(query.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlay className="w-4 h-4" />
                    <span>Run Query</span>
                  </button>
                  
                  <button
                    onClick={() => handleGenerateChart(query.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <FaChartBar className="w-4 h-4" />
                    <span>Generate Chart</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteQuery(query.id)}
                    className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete Query"
                  >
                    <FaTrashAlt className="w-4 h-4" />
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

export default SavedQueriesAccordion;