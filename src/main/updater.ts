import { dialog } from "electron";
import { autoUpdater } from "electron-updater";
import electronLog from "./log";

export default async function updaterCheck() {
	try {
		const res = await autoUpdater.checkForUpdates();

		if (!res) return;

		electronLog.writeLog("[checkForUpdates res] " + JSON.stringify(res));

		autoUpdater.on("update-available", async () => {
			const { response } = await dialog.showMessageBox({
				type: "question",
				buttons: ["Yes", "No"],
				message: "发现新版本，是否要下载？",
			});

			if (response === 0) {
				autoUpdater.downloadUpdate();
			}
		});

		autoUpdater.on("update-downloaded", async () => {
			const { response } = await dialog.showMessageBox({
				type: "question",
				buttons: ["Yes", "No"],
				message: "新版本已下载完毕，是否要安装并重启应用程序？",
			});

			if (response === 0) {
				autoUpdater.quitAndInstall();
			}
		});
	} catch (error) {
		console.error(error);
	}
}
