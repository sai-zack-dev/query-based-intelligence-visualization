export interface ConnectionData {
  id: string | number;
  name: string | null;
  type: "MySQL" | "SQLite" | "Excel" | "CSV";
  host: string | null;
  port: number | null;
  file: string | null;
  date: string;
}
