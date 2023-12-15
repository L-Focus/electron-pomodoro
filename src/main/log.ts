import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { app } from "electron";
import type { WriteStream } from "node:original-fs";

class ElectronLog {
	private logStream: WriteStream;

	constructor() {
		this.logStream = createWriteStream(this.getLogPath(), { flags: "a" });
	}

	private getLogPath = () => {
		if (process.argv[2]) {
			return join(cwd(), "log/log.txt");
		} else {
			return join(app.getPath("userData"), "log/log.txt");
		}
	};

	public writeLog = (text: string) => {
		const now = new Date();
		const timestamp = now.toLocaleString();
		const message = `[${timestamp}] ${text}\n`;
		this.logStream.write(message);
	};

	public closeHandle = () => {
		this.writeLog("ElectronLog closeHandle");
		this.logStream.close();
	};
}

const electronLog = new ElectronLog();

export default electronLog;
