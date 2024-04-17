import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoute';
import userRouter from './routes/userRoute';
import connectToDatabase from './database';
import helmet from 'koa-helmet';
import {
    tokenInterceptorErrorMiddleware,
    tokenInterceptorWhiteListMiddleware,
} from './middlewares/authMiddleware';
import responseTimeMiddleware from "./middlewares/responseTimeMiddleware";
import handleUndefinedRoutes from "./middlewares/handleUndefinedRoutes";
import loggerMiddleware from './middlewares/loggerMiddleware'
import errorMiddleware from "./middlewares/errorMiddleware";


// 加载环境变量
dotenv.config();

const app = new Koa();
const router = new Router();

// 连接数据库
connectToDatabase();

// 使用错误中间件
app.use(errorMiddleware);

// 使用 helmet 中间件增强安全性
app.use(helmet());

// 设置跨域
app.use(cors());

// 处理表单提交
app.use(bodyParser());

// 响应时间中间件
app.use(responseTimeMiddleware);

// 日志中间件
app.use(loggerMiddleware)

// 添加 token 拦截中间件
app.use(tokenInterceptorErrorMiddleware)
    .use(tokenInterceptorWhiteListMiddleware)
    // .use(tokenInterceptorBlackListMiddleware);

// 添加认证相关的路由
app.use(authRouter.routes());

// 添加用户相关的路由
app.use(userRouter.routes());

// 使用处理未定义的接口的中间件
app.use(handleUndefinedRoutes);

// 将路由中间件添加到应用中
app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
