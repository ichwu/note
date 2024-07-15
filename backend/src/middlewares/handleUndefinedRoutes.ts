import {Context, Next} from 'koa';
import {sendErrorResponse} from "../helpers/responseHelper";

const handleUndefinedRoutes = async (ctx: Context, next: Next) => {
    try {
        await next(); // 继续处理下一个中间件
        sendErrorResponse(ctx, ctx.status, ctx.message)
    } catch (error: any) {
        sendErrorResponse(ctx, error.status, error.message)
    }
};

export default handleUndefinedRoutes;
