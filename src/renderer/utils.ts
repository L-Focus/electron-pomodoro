import { ipcRenderer } from "electron";

interface NotificationParam {
	title: string;
	body: string;
	actionText: string;
	closeButtonText: string;
	onclose: () => void;
	onaction: () => void;
}

export async function notification(param: NotificationParam) {
	const { title, body, actionText, closeButtonText, onclose, onaction } = param;
	const res = await ipcRenderer.invoke("notification", {
		title,
		body,
		actions: [{ text: actionText, type: "button" }],
		closeButtonText,
	});
	res.event === "close" ? onclose() : onaction();
}
