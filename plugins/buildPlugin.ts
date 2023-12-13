import { cwd } from "node:process";
import { join } from "node:path";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import esbuild from "esbuild";
import { build } from "electron-builder";
import options from "../electron-builder-config";

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

		esbuild.buildSync({
			entryPoints: ["./src/preload/index.js"],
			bundle: true,
			platform: "node",
			minify: true,
			outfile: "./dist/preload.js",
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
