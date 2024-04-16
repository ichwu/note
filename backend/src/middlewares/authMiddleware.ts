import { Context, Next } from 'koa';
import koaJwt from 'koa-jwt';
import jwt from 'jsonwebtoken';
import { TokenBlacklist } from "../models/TokenBlacklist";

const secret = process.env.TOKEN_SECRET || 'your-secret-key'

const authMiddleware = async (ctx: Context, next: Next) => {
    // 从请求头中获取 Token
    const token = ctx.request.headers.authorization?.split(' ')[1];

    if (!token) {
        ctx.status = 401; // Unauthorized
        ctx.body = { error: 'Token not provided' };
        return;
    }

    try {
        // 验证 Token 的合法性
        const decodedToken = jwt.verify(token, secret);

        // 检查 Token 是否在黑名单中
        const blacklistedToken = await TokenBlacklist.findOne({ token });
        if (blacklistedToken) {
            ctx.status = 401; // Unauthorized
            ctx.body = { error: 'Token is blacklisted' };
            return;
        }

        // 将解码后的 Token 数据存储在 ctx.state 中，方便后续路由处理函数使用
        ctx.state.token = token;
        ctx.state.user = decodedToken;

        await next(); // 继续执行下一个中间件或路由处理函数
    } catch (error) {
        ctx.status = 401; // Unauthorized
        ctx.body = { error: 'Invalid token' };
    }
};

export const tokenInterceptor = koaJwt({ secret }).unless({
    path: [/^\/public/, /login/, /register/]
});

export default authMiddleware;
