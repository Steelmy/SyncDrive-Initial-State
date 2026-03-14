"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  // Instance management
  createInstance: (name) => ipcRenderer.invoke("create-instance", name),
  switchInstance: (instanceId) => ipcRenderer.invoke("switch-instance", instanceId),
  deleteInstance: (instanceId) => ipcRenderer.invoke("delete-instance", instanceId),
  renameInstance: (instanceId, newName) => ipcRenderer.invoke("rename-instance", instanceId, newName),
  // Directory management
  selectDirectory: (instanceId) => ipcRenderer.invoke("select-directory", instanceId),
  updateDirectoryPath: (instanceId, newPath) => ipcRenderer.invoke("update-directory-path", instanceId, newPath),
  selectDownloadDirectory: (instanceId) => ipcRenderer.invoke("select-download-directory", instanceId),
  updateDownloadSettings: (instanceId, settings) => ipcRenderer.invoke("update-download-settings", instanceId, settings),
  // Sync settings
  updateSyncInterval: (instanceId, intervalMinutes) => ipcRenderer.invoke("update-sync-interval", instanceId, intervalMinutes),
  updateZipMode: (instanceId, zipMode) => ipcRenderer.invoke("update-zip-mode", instanceId, zipMode),
  updateAutoSync: (instanceId, enabled) => ipcRenderer.invoke("update-auto-sync", instanceId, enabled),
  // Google authentication
  getGoogleAuthUrl: (instanceId) => ipcRenderer.invoke("get-google-auth-url", instanceId),
  authenticateWithCode: (instanceId, authCode) => ipcRenderer.invoke("authenticate-with-code", instanceId, authCode),
  authenticateGoogle: (instanceId) => ipcRenderer.invoke("authenticate-google", instanceId),
  logoutGoogle: (instanceId) => ipcRenderer.invoke("logout-google", instanceId),
  // Sync operations
  syncNow: (instanceId) => ipcRenderer.invoke("sync-now", instanceId),
  downloadFromDrive: (instanceId, options) => ipcRenderer.invoke("download-from-drive", instanceId, options),
  getConfig: () => ipcRenderer.invoke("get-config"),
  // Dark mode
  getDarkMode: () => ipcRenderer.invoke("get-dark-mode"),
  setDarkMode: (enabled) => ipcRenderer.invoke("set-dark-mode", enabled),
  // Event listeners (with cleanup support)
  onConfigLoaded: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on("config-loaded", handler);
    return () => ipcRenderer.removeListener("config-loaded", handler);
  },
  onSyncCompleted: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on("sync-completed", handler);
    return () => ipcRenderer.removeListener("sync-completed", handler);
  }
});
