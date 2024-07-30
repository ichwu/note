import {Context, Next} from 'koa';
import koaJwt from 'koa-jwt';
import { Blocklist } from "../models/Blocklist";
import { sendErrorResponse } from "../helpers/responseHelper";
import {User} from "../models/User";

const secret = process.env.TOKEN_SECRET || 'your-secret-key'

export const tokenInterceptorErrorMiddleware = async (ctx: Context, next: Next) => {
    try {
        await next()
    } catch (error: any) {
        sendErrorResponse(ctx, error.status, error.message)
    }
}

export const tokenInterceptorWhiteListMiddleware = koaJwt({secret}).unless({
    path: [/^\/public/, /\/login/, /\/register/, /\/openapi/, /\/docs/]
});

export const tokenInterceptorBlackListMiddleware = async (ctx: Context, next: Next) => {
    // 这里检查 ctx.state.user 是否存在，如果存在，表示已通过 JWT 验证
    if (ctx.state.user) {
        try {
            // 如果需要验证的路径，可以在这里执行一些自定义逻辑
            const token = ctx.request.headers.authorization?.split(' ')[1] || '';
            // 检查 Token 是否在黑名单中
            const blacklistedToken = await Blocklist.findOne({token});
            if (blacklistedToken) {
                sendErrorResponse(ctx, 401, 'Token is blacklisted')
                return;
            }
            // 为 ctx.state.user 添加 userId 属性
            const username = ctx.state.user.username
            const user = await User.findOne({username: username});
            // 如果未找到用户，则发送 404 错误响应
            if (!user) {
                sendErrorResponse(ctx, 404, 'User not found');
                return;
            }
            ctx.state.user.userId = user.id
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
