/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { ipcRenderer } = require("electron");
/**
 * @type {import("./preload").NotificationFunc}
 */
const notificationFunc = async (param) => {
	const { title, body, actionText, closeButtonText, onclose, onaction } = param;
	const res = await ipcRenderer.invoke("notification", {
		title,
		body,
		actions: [{ text: actionText, type: "button" }],
		closeButtonText,
	});
	res.event === "close" ? onclose() : onaction();
};

module.exports = notificationFunc;
