import { dialog } from "electron";
import { autoUpdater } from "electron-updater";
import electronLog from "./log";

export default async function updaterCheck() {
	try {
		autoUpdater.setFeedURL('http://localhost:5500/download/latest');
		const res = await autoUpdater.checkForUpdates();

		if (!res) return;

		electronLog.writeLog("[checkForUpdates res] " + JSON.stringify(res));

		autoUpdater.addListener("update-downloaded", async () => {
			await dialog.showMessageBox({
				type: "info",
				message: "有可用的升级",
			});

			autoUpdater.quitAndInstall();
		});
	} catch (error) {
		console.error(error);
	}
}
