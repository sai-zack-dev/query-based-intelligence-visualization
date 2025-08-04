export interface ConnectionData {
  id: string | number;
  name: string | null;
  type: ConnectionType;
  host: string | null;
  port: number | null;
  file: string | null; // stored as JSON string (e.g., '["file1.xlsx", "file2.xlsx"]')
  date: string | null;
}

export interface FormData {
  name: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

export type ConnectionType = "mysql" | "excel" | "csv" | "sqlite" | "";
export type ConnectionStatus = "idle" | "loading" | "success" | "error";
