import type { NotificationFunc } from '../preload/preload.d.ts';

export interface IElectronAPI {
	platform: () => NodeJS.Platform;
	notificationFunc: NotificationFunc;
}

declare global {
	interface Window {
		electronAPI: IElectronAPI;
	}
}
