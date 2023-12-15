import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { app } from "electron";

const getLogPath = () => {
	if (process.argv[2]) {
		return join(cwd(), "log/log.txt");
	} else {
		return join(app.getPath("userData"), "log.txt");
	}
};

const logStream = createWriteStream(getLogPath(), { flags: "a" });

export function writeLog(text: string) {
	const now = new Date();
	const timestamp = now.toLocaleString();
	const message = `[${timestamp}] ${text}\n`;
	logStream.write(message);
}
