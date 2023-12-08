import { spawn } from "node:child_process";
import { ViteDevServer } from "vite";
import esbuild from "esbuild";
import type { AddressInfo } from "node:net";

export function devPlugin() {
	return {
		name: "dev-plugin",
		configureServer(server: ViteDevServer) {
			esbuild.buildSync({
				entryPoints: ["./src/main/mainEntry.ts"],
				bundle: true,
				platform: "node",
				outfile: "./dist/mainEntry.js",
				external: ["electron"],
			});

			const { httpServer } = server;

			if (!httpServer) {
				console.error("server.httpServer 为 null");
				return;
			}

			httpServer.once("listening", () => {
				const addressInfo = httpServer.address() as AddressInfo;
				const httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
				console.log(httpAddress);

				const electronProcess = spawn(
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					require("electron").toString(),
					["./dist/mainEntry.js", httpAddress],
					{
						cwd: process.cwd(),
						stdio: "inherit",
					}
				);

				electronProcess.on("close", () => {
					server.close();
					process.exit();
				});
			});
		},
	};
}

export function getReplacer() {
	const externalModels = [
		"os",
		"fs",
		"path",
		"events",
		"child_process",
		"crypto",
		"http",
		"buffer",
		"url",
		"better-sqlite3",
		"knex",
	];
	const result = {};
	for (const item of externalModels) {
		result[item] = () => ({
			find: new RegExp(`^${item}$`),
			code: `const ${item} = require('${item}');export { ${item} as default }`,
		});
	}
	result["electron"] = () => {
		const electronModules = [
			"clipboard",
			"ipcRenderer",
			"nativeImage",
			"shell",
			"webFrame",
		].join(",");
		return {
			find: new RegExp(`^electron$`),
			code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
		};
	};
	return result;
}
