import { dialog } from "electron";
import { autoUpdater } from "electron-updater";
import { writeLog } from "./log";

export default async function updaterCheck() {
	try {
		const res = await autoUpdater.checkForUpdates();

		if (!res) return;

		writeLog("[checkForUpdates res] " + JSON.stringify(res));

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
