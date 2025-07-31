import { Join, ManualFormState } from "@/types/querybuilder";
import React, { createContext, useContext, useState } from "react";

interface QueryBuilderContextProps {
  selectedDatabase: string | null;
  setSelectedDatabase: (db: string | null) => void;
  sql: string;
  setSql: (sql: string) => void;
  manualForm: ManualFormState | null;
  setManualForm: (form: ManualFormState | null) => void;
  joins: Join[];
  setJoins: React.Dispatch<React.SetStateAction<Join[]>>;
}

const QueryBuilderContext = createContext<QueryBuilderContextProps | undefined>(
  undefined
);

export const QueryBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [manualForm, setManualForm] = useState<ManualFormState | null>(null);
  const [joins, setJoins] = useState<Join[]>([]);

  const [sql, setSql] = useState<string>(""); // Add SQL state
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(
    localStorage.getItem("qbiv-selected-db") || null
  );

  const updateDatabase = (db: string | null) => {
    setSelectedDatabase(db);
    localStorage.setItem("qbiv-selected-db", db || "");
  };

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
      }}
    >
      {children}
    </QueryBuilderContext.Provider>
  );
};

// Custom hook
export const useQueryBuilderContext = () => {
  const ctx = useContext(QueryBuilderContext);
  if (!ctx)
    throw new Error(
      "useQueryBuilderContext must be used within QueryBuilderProvider"
    );
  return ctx;
};
