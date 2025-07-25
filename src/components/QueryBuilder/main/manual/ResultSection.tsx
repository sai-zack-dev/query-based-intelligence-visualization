// @/components/QueryBuilder/main/manual/ResultSection.tsx
import React from "react";

interface ResultSectionProps {
  loading: boolean;
  error?: string | null;
  data?: any[];
}

const ResultSection: React.FC<ResultSectionProps> = ({
  loading,
  error,
  data,
}) => {
  if (loading) return <p className="text-sm text-gray-500">Running query…</p>;
  if (error) return <p className="text-sm text-red-500">Error: {error}</p>;
  if (!data || data.length === 0)
    return <p className="text-sm text-gray-500">No results found.</p>;

  return (
    <div className="border rounded-lg mt-2 overflow-x-auto">
      <table className="text-sm w-full">
        <thead className="bg-blue-100 text-left">
          <tr>
            {Object.keys(data[0]).map((col) => (
              <th key={col} className="px-3 py-2 border-b font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
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
  );
};

export default ResultSection;
