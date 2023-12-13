import { join } from "node:path";
import { cwd } from "node:process";
import { app } from "electron";

export const getPreloadPath = () => {
	if (process.argv[2]) {
		return join(cwd(), "./src/preload/index.js");
	} else {
		return join(app.getAppPath(), "./preload.js");
	}
};
