// electron/events/appEvents.ts - App-level event handlers
import { app, BrowserWindow } from "electron";

export function setupAppEvents(createWindowCallback: () => BrowserWindow) {
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindowCallback();
    }
  });
}