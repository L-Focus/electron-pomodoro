import { app, BrowserWindow } from "electron";
import registerScheme from "./customScheme";
import handleIPC from "./handleIPC";
import { getPreloadPath } from "./utils";
import updaterCheck from "./updater";
import type { BrowserWindowConstructorOptions } from "electron";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
	handleIPC();
	updaterCheck();

	const config: BrowserWindowConstructorOptions = {
		width: 350,
		height: 350,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			allowRunningInsecureContent: true,
			contextIsolation: true,
			webviewTag: true,
			spellcheck: false,
			disableHtmlFullscreenWindowResize: true,
			preload: getPreloadPath(),
		},
	};
	mainWindow = new BrowserWindow(config);

	if (process.argv[2]) {
		mainWindow.webContents.openDevTools();
		mainWindow.loadURL(process.argv[2]);
	} else {
		registerScheme();
		mainWindow.loadURL(`app://index.html`);
	}
});
