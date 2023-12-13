/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { contextBridge } = require("electron/renderer");
const notificationFunc = require("./utils.js");

console.log("preload.js 文件加载成功");

contextBridge.exposeInMainWorld("electronAPI", {
	platform: () => window.process.platform,
	notificationFunc,
});
