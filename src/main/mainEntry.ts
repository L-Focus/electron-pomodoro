import { app, BrowserWindow } from "electron";
import registerScheme from "./CustomScheme";
import type { BrowserWindowConstructorOptions } from "electron";
import handleIPC from "./handleIPC";

// 用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了。
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
	handleIPC()

	const config: BrowserWindowConstructorOptions = {
		width: 350,
		height: 350,
		webPreferences: {
			// 把 Node.js 环境集成到渲染进程中
			nodeIntegration: true,
			webSecurity: false,
			allowRunningInsecureContent: true,
			// 在同一个 JavaScript 上下文中使用 Electron API
			contextIsolation: false,
			webviewTag: true,
			spellcheck: false,
			disableHtmlFullscreenWindowResize: true,
		},
	};
	mainWindow = new BrowserWindow(config);

	if (process.argv[2]) {
		// 仅在生产环境打开devtools
		mainWindow.webContents.openDevTools();
		mainWindow.loadURL(process.argv[2]);
	} else {
		registerScheme();
		mainWindow.loadURL(`app://index.html`);
	}
});
