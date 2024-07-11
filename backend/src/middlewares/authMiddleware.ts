import {Context, Next} from 'koa';
import koaJwt from 'koa-jwt';
import {TokenBlacklist} from "../models/TokenBlacklist";
import { sendErrorResponse } from "../helpers/responseHelper";

const secret = process.env.TOKEN_SECRET || 'your-secret-key'

export const tokenInterceptorErrorMiddleware = async (ctx: Context, next: Next) => {
    try {
        await next()
    } catch (error: any) {
        sendErrorResponse(ctx, error.status, error.message)
    }
}

export const tokenInterceptorWhiteListMiddleware = koaJwt({secret}).unless({
    path: [/^\/public/, /\/login/, /\/register/, /\/openapi/, /\/doc/]
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
                sendErrorResponse(ctx, 401, 'Token is blacklisted')
                return;
            }
            // 然后继续执行下一个中间件
            await next();
        } catch (error: any) {
            sendErrorResponse(ctx, error.status, error.message)
        }
    } else {
        // 如果不需要验证的路径，则直接执行下一个中间件
        await next();
    }
};
