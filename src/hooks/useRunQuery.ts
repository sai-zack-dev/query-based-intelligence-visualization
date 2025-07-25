// hooks/useRunQuery.ts
import { useState } from "react";

export const useRunQuery = () => {
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async (database: string | null, query: string) => {
    if (!database) {
      setError("No database selected.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await window.ipcRenderer.invoke("run-sql-query", {
        database,
        query,
      });

      if (!response.success) {
        setError(response.message || "Failed to run query.");
      } else {
        setResult(response.data || []);
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
