import React, { createContext, useContext, useState, useEffect } from "react";
import { Join, ManualFormState } from "@/types/querybuilder";

/** Types for extended connection data */
export type ConnectionMeta = {
  name: string;
  host: string | null;
  port: number | null;
  file: string | null;
  type: string;
  lastUpdate: string;
};

interface QueryBuilderContextProps {
  selectedDatabase: string | null;
  setSelectedDatabase: (db: string | null) => void;

  sql: string;
  setSql: (sql: string) => void;

  manualForm: ManualFormState | null;
  setManualForm: (form: ManualFormState | null) => void;

  joins: Join[];
  setJoins: React.Dispatch<React.SetStateAction<Join[]>>;

  meta: ConnectionMeta | null;
  databases: string[];
  tables: string[];
  schema: Record<string, Record<string, any[]>> | null;

  loading: {
    meta: boolean;
    dbs: boolean;
  };

  error: string | null;

  fetchMeta: () => Promise<void>;
  fetchDatabases: () => Promise<void>;
  fetchFullSchema: (db: string) => Promise<void>;

  setTables: React.Dispatch<React.SetStateAction<string[]>>;
  setSchema: React.Dispatch<
    React.SetStateAction<Record<string, Record<string, any[]>> | null>
  >;
}

const QueryBuilderContext = createContext<QueryBuilderContextProps | undefined>(
  undefined
);

export const QueryBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sql, setSql] = useState<string>("");
  const [manualForm, setManualForm] = useState<ManualFormState | null>(null);
  const [joins, setJoins] = useState<Join[]>([]);

  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(
    localStorage.getItem("qbiv-selected-db") || null
  );

  const updateDatabase = (db: string | null) => {
    setSelectedDatabase(db);
    localStorage.setItem("qbiv-selected-db", db || "");
  };

  const [meta, setMeta] = useState<ConnectionMeta | null>(null);
  const [databases, setDatabases] = useState<string[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [schema, setSchema] = useState<Record<string, Record<string, any[]>> | null>(null);

  const [loading, setLoading] = useState({
    meta: false,
    dbs: false,
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

  const fetchFullSchema = async (dbName: string) => {
    try {
      const res = await window.ipcRenderer.invoke("get-database-explorer-data");
      const dbData = res.explorer?.[dbName];

      if (res.success && dbData?.tables) {
        const fullSchema: Record<string, any[]> = {};
        for (const table of dbData.tables) {
          const tableSchema = dbData.schema?.[table];
          if (tableSchema) {
            fullSchema[table] = tableSchema;
          }
        }

        setTables(dbData.tables || []);
        setSchema((prev) => ({
          ...prev,
          [dbName]: fullSchema,
        }));
      } else {
        setTables([]);
        setSchema((prev) => ({ ...prev, [dbName]: {} }));
        console.warn("No schema or tables found.");
      }
    } catch (err: any) {
      console.error("Failed to fetch full schema:", err.message);
    }
  };

  useEffect(() => {
    if (selectedDatabase) {
      fetchFullSchema(selectedDatabase);
    }
  }, [selectedDatabase]);

  return (
    <QueryBuilderContext.Provider
      value={{
        selectedDatabase,
        setSelectedDatabase: updateDatabase,
        sql,
        setSql,
        manualForm,
        setManualForm,
        joins,
        setJoins,

        meta,
        databases,
        tables,
        schema,
        loading,
        error,

        fetchMeta,
        fetchDatabases,
        fetchFullSchema,
        setTables,
        setSchema,
      }}
    >
      {children}
    </QueryBuilderContext.Provider>
  );
};

// Custom hook
export const useQueryBuilderContext = () => {
  const ctx = useContext(QueryBuilderContext);
  if (!ctx) {
    throw new Error("useQueryBuilderContext must be used within QueryBuilderProvider");
  }
  return ctx;
};
