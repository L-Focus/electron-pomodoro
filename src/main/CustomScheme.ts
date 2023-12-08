import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { protocol } from "electron";
import type { Privileges } from "electron";

const schemeConfig: Privileges = {
	standard: true,
	supportFetchAPI: true,
	bypassCSP: true,
	corsEnabled: true,
	stream: true,
};

protocol.registerSchemesAsPrivileged([
	{ scheme: "app", privileges: schemeConfig },
]);

/** 根据文件扩展名获取mime-type */
function getMimeType(extension: string): string {
	const MimeTypeMap: Record<string, string> = {
		".js": "text/javascript",
		".html": "text/html",
		".css": "text/css",
		".svg": "image/svg+xml",
		".json": "application/json",
	};

	const keys = Object.keys(MimeTypeMap);
	if (!keys.includes(extension)) {
		throw new Error(
			"The mime type of the corresponding file could not be found"
		);
	}

	return MimeTypeMap[extension];
}

export default function registerScheme() {
	protocol.handle("app", (request) => {
		let pathName = new URL(request.url).pathname;
		let extension = extname(pathName).toLowerCase();
		if (extension == "") {
			pathName = "index.html";
			extension = ".html";
		}
		const tarFile = join(__dirname, pathName);

		return new Response(readFileSync(tarFile), {
			status: 200,
			headers: { "content-type": getMimeType(extension) },
		});
	});
}
