process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import mysql from "mysql2/promise"; // ✅ import mysql2
import { addConnection, getAllConnections } from "./db";
// import { fileURLToPath } from 'url';
// import path from 'path';

(globalThis as any).__filename = fileURLToPath(import.meta.url);
// (globalThis as any).__dirname = path.dirname(__filename);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  // console.log("Creating window...");
  // console.log("VITE_DEV_SERVER_URL:", VITE_DEV_SERVER_URL);
  // console.log("RENDERER_DIST:", RENDERER_DIST);

  win = new BrowserWindow({
    minWidth: 700,
    minHeight: 300,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  win.webContents.openDevTools();
  win.webContents.on("did-finish-load", () => {
    // console.log("Renderer loaded.");
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

// ✅✅✅ Add MySQL IPC handler here
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

ipcMain.handle("save-connection", (_, conn) => {
  addConnection(conn);
  return { success: true };
});

ipcMain.handle("get-connections", () => {
  const connections = getAllConnections();
  return connections;
});
