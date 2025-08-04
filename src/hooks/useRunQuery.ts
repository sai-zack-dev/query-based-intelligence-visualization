// hooks/useRunQuery.ts
import { useState } from "react";

export const useRunQuery = () => {
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async (
    database: string | null,
    query: string
  ): Promise<any[] | undefined> => {
    if (!database) {
      setError("No database selected.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    console.log(query)

    try {
      const response = await window.ipcRenderer.invoke("run-sql-query", {
        database,
        query,
      });

      if (!response.success) {
        setError(response.message || "Failed to run query.");
      } else {
        setResult(response.data || []);
        return response.data || []; // ✅ return the result here
      }
    } catch (err) {
      setError("Unexpected error running query.");
    } finally {
      setLoading(false);
    }
  };

  return {
    runQuery,
    result,
    loading,
    error,
  };
};
