// electron/main.ts - Entry point and app lifecycle management
import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { setupErrorHandlers } from "./utils/errorHandlers";
import { createMainWindow } from "./windows/mainWindow";
import { setupIpcHandlers } from "./ipc/ipcHandlers";
import { setupAppEvents } from "./events/appEvents";
import { initDatabase } from "./db/core";

// Setup global error handlers
setupErrorHandlers();

// Setup global paths
(globalThis as any).__filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let mainWindow: BrowserWindow | null = null;

async function initializeApp() {
// ✅ Ensure database is initialized before anything else
  await initDatabase();

  // Create main window
  mainWindow = createMainWindow();
  
  // Setup IPC handlers
  setupIpcHandlers();
  
  // Setup app event listeners
  setupAppEvents(() => createMainWindow());
}

// App ready event
app.whenReady().then(initializeApp);

export { mainWindow };