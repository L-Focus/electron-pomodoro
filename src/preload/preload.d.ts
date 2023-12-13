interface NotificationParam {
	title: string;
	body: string;
	actionText: string;
	closeButtonText: string;
	onclose: () => void;
	onaction: () => void;
}

export interface NotificationFunc {
	(params: NotificationParam): Promise<void>;
}
