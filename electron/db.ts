import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";

let db: Database.Database | null = null;

function getDbPath(): string {
  // Add a check to ensure app is ready
  if (!app.isReady()) {
    throw new Error("Cannot access userData path before app is ready");
  }
  
  const p = path.join(app.getPath("userData"), "connections.db");
  console.log("Using SQLite path:", p);
  return p;
}


export function getDatabase() {
  if (!db) {
    const dbPath = getDbPath(); // ✅ app.getPath() runs *after* app is ready
    db = new Database(dbPath);
    console.log(db)
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
    `);
  }
  return db;
}

export function getAllConnections() {
  const db = getDatabase();
  const stmt = db.prepare("SELECT * FROM connections");
  return stmt.all();
}

export function addConnection(conn: {
  name: string;
  type: string;
  host: string;
  port: string;
  username: string;
  database: string;
}) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO connections (name, type, host, port, username, database)
    VALUES (@name, @type, @host, @port, @username, @database)
  `);
  stmt.run(conn);
}

