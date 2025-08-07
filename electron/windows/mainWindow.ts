// electron/windows/mainWindow.ts - Main window creation and management
import { BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { VITE_DEV_SERVER_URL, RENDERER_DIST } from "../main";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    minWidth: 720,
    minHeight: 480,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "/preload.mjs"),
    },
  });

  // Uncomment for development
  // win.webContents.openDevTools();

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
  win.loadFile(path.join(RENDERER_DIST, "index.html"));

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  return win;
}
