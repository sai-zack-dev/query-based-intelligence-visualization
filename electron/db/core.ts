// db/core.ts
import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";

let db: Database.Database | null = null;

export async function initDatabase(): Promise<void> {
  const dbPath = path.join(app.getPath("userData"), "test.db"); // gonna change qbiv.db to production and test.db in test
  console.log("Using SQLite path:", dbPath);
  db = new Database(dbPath);
  console.log("Db path:", dbPath);
  // Centralized table creation
  db.exec(`
    CREATE TABLE IF NOT EXISTS connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      host TEXT,
      port TEXT,
      username TEXT,
      database TEXT
    );
    
    CREATE TABLE IF NOT EXISTS charts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      config TEXT,
      data TEXT
    );

    CREATE TABLE IF NOT EXISTS dashboards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT NOT NULL,
      name TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS dashboard_charts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dashboard_id INTEGER NOT NULL,
      chart_id INTEGER NOT NULL,
      x INTEGER NOT NULL DEFAULT 0,
      y INTEGER NOT NULL DEFAULT 0,
      width INTEGER NOT NULL DEFAULT 4,
      height INTEGER NOT NULL DEFAULT 4,
      FOREIGN KEY (dashboard_id) REFERENCES dashboards(id),
      FOREIGN KEY (chart_id) REFERENCES charts(id)
    );
  `);
}

export function getDatabase(): Database.Database {
  if (!db)
    throw new Error(
      "Database not initialized. Call initDatabase() after app is ready."
    );
  return db;
}
