import { cwd } from "node:process";
import { join } from "node:path";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import esbuild from "esbuild";
import { build } from "electron-builder";
import type { CliOptions } from "electron-builder";

class BuildObj {
	buildMain() {
		esbuild.buildSync({
			entryPoints: ["./src/main/mainEntry.ts"],
			bundle: true,
			platform: "node",
			minify: true,
			outfile: "./dist/mainEntry.js",
			external: ["electron"],
		});
	}

	preparePackageJson() {
		const cwdPath = cwd();
		const pkgJsonPath = join(cwdPath, "package.json");
		const localPkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
		const electronConfig = localPkgJson.devDependencies.electron.replace(
			"^",
			""
		);

		localPkgJson.main = "mainEntry.js";
		delete localPkgJson.script;
		delete localPkgJson.devDependencies;
		Object.assign(localPkgJson, {
			devDependencies: { electron: electronConfig },
		});

		const tarJsonPath = join(cwdPath, "dist", "package.json");

		writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
		mkdirSync(join(cwdPath, "dist/node_modules"));
	}

	buildInstaller() {
		console.log("buildInstaller --->");

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
				},
				files: ["**"],
				extends: null,
				asar: true,
				publish: [{ provider: "generic", url: "http://localhost:5500/" }],
			},
			projectDir: cwd(),
		};

		return build(options);
	}
}

export function buildPlugin() {
	return {
		name: "build-plugin",
		closeBundle() {
			const buildObj = new BuildObj();
			buildObj.buildMain();
			buildObj.preparePackageJson();
			buildObj.buildInstaller();
		},
	};
}
