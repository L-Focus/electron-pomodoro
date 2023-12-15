import { join } from "node:path";
import { cwd } from "node:process";
import express from "express";
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
	const filePath = join(cwd(), "release", "Pomodoro-0.0.0.dmg");
	res.download(filePath);
});

// 启动服务
app.listen(5500, () => {
	console.log("Server started on port 5500");
});
