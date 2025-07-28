// electron/db/queries.ts
import { getDatabase } from "./core";
import { v4 as uuidv4 } from "uuid";
import { QueryRecord } from "@/types/query";

export function addQuery(query: {
  name: string;
  description: string;
  sql: string;
  connection_id?: number;
}): string {
  const db = getDatabase();
  const uuid = uuidv4();

  db.prepare(`
    INSERT INTO queries (uuid, name, description, sql, connection_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(uuid, query.name, query.description, query.sql, query.connection_id ?? null);

  return uuid;
}

export function getAllQueries(): QueryRecord[] {
  const db = getDatabase();
  return db.prepare(`SELECT * FROM queries ORDER BY created_at DESC`).all() as QueryRecord[];
}

export function getQueryById(id: number): QueryRecord | undefined {
  const db = getDatabase();
  return db.prepare(`SELECT * FROM queries WHERE id = ?`).get(id) as QueryRecord;
}

export function deleteQueryById(id: number): boolean {
  const db = getDatabase();
  const result = db.prepare(`DELETE FROM queries WHERE id = ?`).run(id);
  return result.changes > 0;
}
