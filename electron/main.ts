process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import mysql from "mysql2/promise";
import {
  addConnection,
  getAllConnections,
  updateConnectionByName,
  updateConnectionNameByConfig,
  findConnectionByName,
  findConnectionByConfig,
} from "./db";
import type { ConnectionData } from "@/types/connection";

(globalThis as any).__filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let activeConnection: mysql.Connection | null = null;
let activeConnectionMeta: ConnectionData | null = null;

function createWindow() {
  win = new BrowserWindow({
    minWidth: 700,
    minHeight: 300,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  // win.webContents.openDevTools();

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

// MySQL Test Handler
ipcMain.handle("test-mysql-connection", async (_, config) => {
  const { host, port, username, password, database } = config;

  try {
    const connection = await mysql.createConnection({
      host,
      port: Number(port),
      user: username,
      password,
      database,
    });

    await connection.connect();
    await connection.end();

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
});

// Save Connection Handler with Conflict Check
ipcMain.handle("save-connection", async (_, conn) => {
  try {
    // Validate required fields without throwing
    const missingFields = [];
    if (!conn?.name) missingFields.push("Name");
    if (!conn?.host) missingFields.push("Host");
    if (!conn?.port) missingFields.push("Port");
    if (!conn?.username) missingFields.push("Username");

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      };
    }

    const nameMatch = findConnectionByName(conn.name);
    const configMatch = findConnectionByConfig(
      conn.host,
      conn.port,
      conn.username
    );

    if (nameMatch) {
      return { conflict: "name", existing: nameMatch };
    } else if (configMatch) {
      return { conflict: "config", existing: configMatch };
    }

    addConnection(conn);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save connection:", err);
    return { success: false, message: err.message || "Unknown error" };
  }
});

// Update connection by name
ipcMain.handle("update-connection-by-name", async (_, conn) => {
  try {
    // Validate required fields
    const missingFields = [];
    if (!conn?.name) missingFields.push("Name");
    if (!conn?.host) missingFields.push("Host");
    if (!conn?.port) missingFields.push("Port");
    if (!conn?.username) missingFields.push("Username");

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      };
    }

    updateConnectionByName(conn);
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update connection:", err);
    return { success: false, message: err.message || "Update failed" };
  }
});

// Update connection name by config (host+port+username)
ipcMain.handle("update-connection-name-by-config", async (_, payload) => {
  try {
    // Validate required fields
    const missingFields = [];
    if (!payload?.name) missingFields.push("Name");
    if (!payload?.host) missingFields.push("Host");
    if (!payload?.port) missingFields.push("Port");
    if (!payload?.username) missingFields.push("Username");

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      };
    }

    updateConnectionNameByConfig(
      payload.name,
      payload.host,
      payload.port,
      payload.username
    );
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update connection name:", err);
    return { success: false, message: err.message || "Rename failed" };
  }
});

// Force create connection with unique name handling
ipcMain.handle("force-create-connection", async (_, conn) => {
  try {
    // Validate required fields
    const missingFields = [];
    if (!conn?.name) missingFields.push("Name");
    if (!conn?.host) missingFields.push("Host");
    if (!conn?.port) missingFields.push("Port");
    if (!conn?.username) missingFields.push("Username");

    if (missingFields.length > 0) {
      return {
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      };
    }

    // Generate a unique name if needed
    let uniqueName = conn.name;
    let counter = 1;
    while (findConnectionByName(uniqueName)) {
      uniqueName = `${conn.name}_${counter}`;
      counter++;
    }

    const connectionWithUniqueName = {
      ...conn,
      name: uniqueName,
    };

    addConnection(connectionWithUniqueName);
    return { success: true, savedName: uniqueName };
  } catch (err: any) {
    console.error("Failed to force create connection:", err);
    return { success: false, message: err.message || "Unknown error" };
  }
});

// Get all connections
ipcMain.handle("get-connections", () => {
  try {
    return getAllConnections();
  } catch (err: any) {
    console.error("Failed to get connections:", err);
    return {
      success: false,
      message: err.message || "Failed to retrieve connections",
    };
  }
});

ipcMain.handle("disconnect-database", async () => {
  try {
    if (activeConnection) {
      await activeConnection.end();
      activeConnection = null;
    }
    return { success: true };
  } catch (err: any) {
    console.error("Failed to disconnect:", err);
    return { success: false, message: err.message };
  }
});

ipcMain.handle("connect-to-database", async (_, conn) => {
  try {
    if (activeConnection) {
      await activeConnection.end();
      activeConnection = null;
      activeConnectionMeta = null;
    }

    const connection = await mysql.createConnection({
      host: conn.host,
      port: parseInt(conn.port),
      user: conn.username,
      password: conn.password,
      database: conn.database,
    });

    activeConnection = connection;

    activeConnectionMeta = {
      id: Date.now(), // or conn.id
      name: conn.name ?? "Untitled",
      type: "mysql",
      host: conn.host ?? null,
      port: conn.port ? parseInt(conn.port) : null,
      file: null,
      date: new Date().toISOString(),
    };
console.log("✅ activeConnectionMeta SET:", activeConnectionMeta);
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
});



// 🟦 NEW: For Data Source panel
ipcMain.handle("get-active-connection-meta", async () => {
  if (activeConnectionMeta) {
    return { success: true, meta: activeConnectionMeta };
  }
  return { success: false, message: "No active connection" };
});


// 🟦 NEW: For Data Explorer
ipcMain.handle("get-database-explorer-data", async () => {
  if (!activeConnection) {
    return { success: false, message: "No active connection" };
  }

  try {
    const [dbRows]: [any[], any] = await activeConnection.query(
      "SHOW DATABASES"
    );
    const databases: string[] = dbRows.map((row: any) => row.Database);

    const dbData: Record<
      string,
      {
        tables: string[];
        schema: Record<string, any[]>;
      }
    > = {};

    for (const db of databases) {
      await activeConnection.query(`USE \`${db}\``);

      const [tableRows]: [any[], any] = await activeConnection.query(
        "SHOW TABLES"
      );
      const tableNames: string[] = (tableRows as any[]).map(
        (t) => Object.values(t)[0] as string
      );

      const tableSchemas: Record<string, any[]> = {};

      for (const table of tableNames) {
        const [columns]: [any[], any] = await activeConnection.query(
          `DESCRIBE \`${table}\``
        );
        tableSchemas[table] = columns;
      }

      dbData[db] = {
        tables: tableNames,
        schema: tableSchemas,
      };
    }

    return { success: true, explorer: dbData };
  } catch (err: any) {
    console.error("Explorer error:", err);
    return { success: false, message: err.message };
  }
});
