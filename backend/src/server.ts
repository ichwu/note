import dotenv from 'dotenv';
/** 需要放到开头，以免调用和定义 secret 的值不一致 **/
dotenv.config();
import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import connectToDatabase from './database';
import compress from 'koa-compress';
import serve from 'koa-static';
import {
    tokenInterceptorBlackListMiddleware,
    tokenInterceptorErrorMiddleware,
    tokenInterceptorWhiteListMiddleware,
} from './middlewares/authMiddleware';
import responseTimeMiddleware from "./middlewares/responseTimeMiddleware";
import handleUndefinedRoutes from "./middlewares/handleUndefinedRoutes";
import loggerMiddleware from './middlewares/loggerMiddleware';
import errorMiddleware from "./middlewares/errorMiddleware";
import rateLimitMiddleware from "./middlewares/rateLimitMiddleware";
import swaggerMiddleware from "./middlewares/swaggerMiddleware";
import helmetMiddleware from "./middlewares/helmetMiddleware";

const app = new Koa();
const router = new Router();

// 连接数据库
connectToDatabase();

// 使用错误中间件
app.use(errorMiddleware);

// 使用 helmet 中间件增强安全性
app.use(helmetMiddleware);

// 设置跨域
app.use(cors());

// 处理表单提交
app.use(bodyParser());

// 响应时间中间件
app.use(responseTimeMiddleware);

// 日志中间件
app.use(loggerMiddleware)

// 响应压缩
app.use(compress())

// 添加限流中间件，防止DDOS攻击
app.use(rateLimitMiddleware)

// 静态文件服务
app.use(serve('./public'))

// 使用 Swagger 中间件
app.use(swaggerMiddleware)

// 添加 token 拦截中间件
app.use(tokenInterceptorErrorMiddleware)
    .use(tokenInterceptorWhiteListMiddleware)
    .use(tokenInterceptorBlackListMiddleware);

// 批量导入 routes 目录下的路由
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(file => {
    if (file.endsWith('.ts') || file.endsWith('.js')) {
        const route = require(path.join(routesPath, file)).default;
        app.use(route.routes());
    }
});

// 使用处理未定义的接口的中间件
app.use(handleUndefinedRoutes);

// 将路由中间件添加到应用中
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
