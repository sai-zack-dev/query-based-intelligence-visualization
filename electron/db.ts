import Database from "better-sqlite3";
import path from "node:path";
import { app } from "electron";

let db: Database.Database | null = null;

function getDbPath(): string {
  if (!app.isReady()) {
    throw new Error("Cannot access userData path before app is ready");
  }

  const p = path.join(app.getPath("userData"), "connections.db");
  console.log("Using SQLite path:", p);
  return p;
}

export function getDatabase() {
  if (!db) {
    const dbPath = getDbPath();
    db = new Database(dbPath);
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
  return db.prepare("SELECT * FROM connections").all();
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
  db.prepare(`
    INSERT INTO connections (name, type, host, port, username, database)
    VALUES (@name, @type, @host, @port, @username, @database)
  `).run(conn);
}

export function findConnectionByName(name: string) {
  const db = getDatabase();
  return db.prepare("SELECT * FROM connections WHERE name = ?").get(name);
}

export function findConnectionByConfig(host: string, port: string, username: string) {
  const db = getDatabase();
  return db
    .prepare("SELECT * FROM connections WHERE host = ? AND port = ? AND username = ?")
    .get(host, port, username);
}

export function updateConnectionByName(conn: {
  name: string;
  type: string;
  host: string;
  port: string;
  username: string;
  database: string;
}) {
  const db = getDatabase();
  db.prepare(`
    UPDATE connections
    SET type = @type, host = @host, port = @port, username = @username, database = @database
    WHERE name = @name
  `).run(conn);
}

export function updateConnectionNameByConfig(
  name: string,
  host: string,
  port: string,
  username: string
) {
  const db = getDatabase();
  db.prepare(`
    UPDATE connections
    SET name = ?
    WHERE host = ? AND port = ? AND username = ?
  `).run(name, host, port, username);
}
