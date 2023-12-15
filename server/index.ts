import { join } from "node:path";
import { cwd } from "node:process";
import { readFileSync } from "node:fs";
import express from "express";
import YAML from "yaml";
import type { NextFunction, Request, Response } from "express";

const app = express();
const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
	console.log(`[${new Date()}] ${req.method} ${req.url}`);
	next();
};

// 添加日志中间件
app.use(logMiddleware);

// 设置静态文件目录
app.use(express.static(join(cwd(), "release")));

// 提供下载应用程序最新版本的路由
app.get("/download/latest", (req, res) => {
	const file = readFileSync(join(cwd(), "release", "latest-mac.yml"), "utf8");
	const yaml = YAML.parse(file);
	const filePath = join(cwd(), "release", yaml.path);
	res.download(filePath);
});

// 启动服务
app.listen(5500, () => {
	console.log("Server started on port 5500");
});
