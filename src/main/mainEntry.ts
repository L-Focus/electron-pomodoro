import { app, BrowserWindow } from "electron";
import registerScheme from "./customScheme";
import handleIPC from "./handleIPC";
import { getPreloadPath } from "./utils";
import updaterCheck from "./updater";
import type { BrowserWindowConstructorOptions } from "electron";
import { writeLog } from "./log";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

let mainWindow: BrowserWindow;
app.commandLine.appendSwitch("enable-logging", "stdout");
app.whenReady().then(() => {
	handleIPC();

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

	mainWindow.webContents.openDevTools();
	if (process.argv[2]) {
		mainWindow.loadURL(process.argv[2]);
	} else {
		registerScheme();
		mainWindow.loadURL(`app://index.html`);
	}

	updaterCheck();
});

app.addListener("before-quit", () => {
	writeLog("[before-quit]");
});
