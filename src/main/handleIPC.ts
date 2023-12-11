import { ipcMain, Notification } from "electron";

function handleIPC() {
	ipcMain.handle(
		"notification",
		async (_, { body, title, actions, closeButtonText }) => {
			const res = await new Promise((resolve) => {
				const notification = new Notification({
					title,
					body,
					actions,
					closeButtonText,
				});
				notification.show();
				notification.on("action", () => {
					resolve({ event: "action" });
				});
				notification.on("close", () => {
					resolve({ event: "close" });
				});
			});
			return res;
		}
	);
}

export default handleIPC;
