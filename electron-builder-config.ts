import { cwd } from "node:process";
import { join } from "node:path";
import type { CliOptions } from "electron-builder";

const iconPath = join(cwd(), "src/assets/clock.png");

const options: CliOptions = {
	config: {
		appId: "com.pomodoro.desktop",
		productName: "Pomodoro",
		directories: {
			output: join(cwd(), "release"),
			app: join(cwd(), "dist"),
		},
		nsis: {
			oneClick: true,
			perMachine: true,
			allowToChangeInstallationDirectory: false,
			createDesktopShortcut: true,
			createStartMenuShortcut: true,
			shortcutName: "PomodoroDesktop",
			installerIcon: iconPath,
			installerHeaderIcon: iconPath,
		},
		win: {
			target: "nsis",
			icon: iconPath,
		},
		mac: {
			icon: iconPath,
		},
		files: ["**"],
		extends: null,
		asar: true,
		publish: [{ provider: "generic", url: "http://localhost:5500/" }],
	},
	projectDir: cwd(),
};

export default options;
