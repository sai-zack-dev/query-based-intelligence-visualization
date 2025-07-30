export type ConnectionMeta = {
  name: string;
  host: string;
  type: string;
  lastUpdate: string;
};

export type ExplorerData = Record<
  string,
  {
    tables: string[];
    schema: Record<string, any[]>;
  }
>;

export interface ManualFormState {
  table: string;
  columns: string[];
  filters?: Filter[];
  limit?: number;
  orderBy?: OrderByItem[];
  groupBy?: string[];
  joins?: Join[];
}

// Type for SELECTed columns
export type ColumnSelection = {
  name: string;
  func: "" | "COUNT" | "SUM" | "DATE_FORMAT";
  alias: string;
  format?: string; // only for DATE_FORMAT
};

// Type for JOINs
export type JoinType = "INNER JOIN" | "LEFT JOIN" | "RIGHT JOIN";

export type operatorType = "=" | ">" | "<" | ">=" | "<=" | "!=";

export type Join = {
  type: JoinType;
  table: string;
  on: {
    left: string;
    operator: operatorType;
    right: string;
  };
};

// Type for WHERE Filters
export type Filter = {
  column: string;
  operator: "=" | ">" | "<" | ">=" | "<=" | "!=" | "LIKE";
  value: string;
};

// Type for ORDER BY
export type OrderByItem = {
  column: string;
  direction: "ASC" | "DESC";
};
