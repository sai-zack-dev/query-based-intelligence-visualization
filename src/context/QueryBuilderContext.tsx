import React, { createContext, useContext, useState } from "react";

interface QueryBuilderContextProps {
  selectedDatabase: string | null;
  setSelectedDatabase: (db: string | null) => void;
  sql: string;
  setSql: (sql: string) => void;
}

const QueryBuilderContext = createContext<QueryBuilderContextProps | undefined>(
  undefined
);

export const QueryBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
