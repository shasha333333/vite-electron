import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electronAPI", {
  // 暴露给渲染进程的 API
  getAppPath: () => ipcRenderer.invoke("get-app-path"),
  selectDirectory: () => ipcRenderer.invoke("select-directory")
  // ... 其他 API
});
