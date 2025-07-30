import { useState, useEffect } from "react";

export type ConnectionMeta = {
  name: string;
  host: string | null;
  port: number | null;
  file: string | null;
  type: string;
  lastUpdate: string;
};

export type TableSchema = Record<string, any[]>;

export function useActiveConnection() {
  const [meta, setMeta] = useState<ConnectionMeta | null>(null);
  const [databases, setDatabases] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [schema, setSchema] = useState<Record<
    string,
    Record<string, any[]>
  > | null>(null);

  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(
    () => localStorage.getItem("qbiv-selected-db") || null
  );

  const [loading, setLoading] = useState({
    meta: false,
    dbs: false,
    tables: false,
    schema: false,
  });

  const [error, setError] = useState<string | null>(null);

  const fetchMeta = async () => {
    setLoading((prev) => ({ ...prev, meta: true }));
    try {
      const res = await window.ipcRenderer.invoke("get-active-connection-meta");
      if (res.success) {
        setMeta(res.meta);
      } else {
        setError("Failed to fetch connection meta.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching connection meta");
    } finally {
      setLoading((prev) => ({ ...prev, meta: false }));
    }
  };

  const fetchDatabases = async () => {
    setLoading((prev) => ({ ...prev, dbs: true }));
    try {
      const res = await window.ipcRenderer.invoke("get-database-explorer-data");
      if (res.success) {
        const dbs = Object.keys(res.explorer);
        setDatabases(dbs);
      } else {
        setError("Failed to fetch databases.");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching databases");
    } finally {
      setLoading((prev) => ({ ...prev, dbs: false }));
    }
  };

  const fetchTables = async (dbName: string) => {
    setLoading((prev) => ({ ...prev, tables: true }));
    try {
      const res = await window.ipcRenderer.invoke("get-database-explorer-data");
      const dbData = res.explorer?.[dbName];
      if (res.success && dbData) {
        setTables(dbData.tables || []);
      } else {
        setTables([]); // 🧹 prevent old state from showing
        setError(`No tables found for database ${dbName}`);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching tables");
    } finally {
      setLoading((prev) => ({ ...prev, tables: false }));
    }
  };

  const fetchSchema = async (dbName: string, table: string) => {
    try {
      const res = await window.ipcRenderer.invoke("get-database-explorer-data");
      const tableSchema = res.explorer?.[dbName]?.schema?.[table];
      if (tableSchema) {
        setSchema((prev) => ({
          ...prev,
          [dbName]: {
            ...(prev?.[dbName] || {}),
            [table]: tableSchema,
          },
        }));
      } else {
        console.warn(`Table schema not found for ${dbName}.${table}`);
      }
    } catch (err: any) {
      console.error("Error fetching schema:", err.message);
    }
  };

  useEffect(() => {
    if (selectedDatabase) {
      localStorage.setItem("qbiv-selected-db", selectedDatabase);
    }
  }, [selectedDatabase]);

  return {
    meta,
    databases,
    tables,
    schema,
    loading,
    error,
    fetchMeta,
    fetchDatabases,
    fetchTables,
    fetchSchema,
    selectedDatabase,
    setSelectedDatabase,
    setTables,
    setSchema,
  };
}
