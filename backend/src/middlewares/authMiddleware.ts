import {Context, Next} from 'koa';
import koaJwt from 'koa-jwt';
import {TokenBlacklist} from "../models/TokenBlacklist";

const secret = process.env.TOKEN_SECRET || 'your-secret-key'

export const tokenInterceptorErrorMiddleware = async (ctx: Context, next: Next) => {
    try {
        await next()
    } catch (error: any) {
        if (error.status === 401) {
            ctx.status = 401;
            ctx.body = {error: 'Protected resource, use Authorization header to get access\n'}; // 自定义错误消息
        } else {
            throw error; // 抛出其他错误，交给全局错误处理
        }
    }
}

export const tokenInterceptorWhiteListMiddleware = koaJwt({secret}).unless({
    path: [/^\/public/, /\/login/, /\/register/, /\/openapi/]
});

export const tokenInterceptorBlackListMiddleware = async (ctx: Context, next: Next) => {
    // 这里检查 ctx.state.user 是否存在，如果存在，表示已通过 JWT 验证
    if (ctx.state.user) {
        try {
            // 如果需要验证的路径，可以在这里执行一些自定义逻辑
            const token = ctx.request.headers.authorization?.split(' ')[1] || '';
            // 检查 Token 是否在黑名单中
            const blacklistedToken = await TokenBlacklist.findOne({token});
            if (blacklistedToken) {
                ctx.status = 401; // Unauthorized
                ctx.body = {error: 'Token is blacklisted'};
                return;
            }
            // 然后继续执行下一个中间件
            await next();
        } catch (e) {
            // 可以在这里处理错误
            ctx.status = 401;
            ctx.body = {error: 'Protected resource, use Authorization header to get access\n'};
        }
    } else {
        // 如果不需要验证的路径，则直接执行下一个中间件
        await next();
    }
};
