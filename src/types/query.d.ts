// src/types/query.d.ts
export interface QueryRecord {
  id: number;
  uuid: string;
  name: string;
  description: string;
  sql: string;
  connection_id: number | null;
  created_at: string;
}
