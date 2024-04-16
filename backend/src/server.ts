import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoute';
import userRouter from './routes/userRoute';
import authMiddleware, {tokenInterceptor} from './middlewares/authMiddleware';
import responseTimeMiddleware from "./middlewares/responseTimeMiddleware";
import handleUndefinedRoutes from "./middlewares/handleUndefinedRoutes";
import connectToDatabase from './database';

const app = new Koa();
const router = new Router();

// 加载环境变量
dotenv.config();

// 连接数据库
connectToDatabase();

// 设置跨域
app.use(cors());

// 处理表单提交
app.use(bodyParser());

// 响应时间中间件
app.use(responseTimeMiddleware);

// 添加自定义的 401 处理中间件
app.use(authMiddleware);

// 添加 token 拦截中间件
app.use(tokenInterceptor);

// 添加认证相关的路由
app.use(authRouter.routes());

// 添加用户相关的路由
app.use(userRouter.routes());

// 使用处理未定义的接口的中间件
app.use(handleUndefinedRoutes);

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
