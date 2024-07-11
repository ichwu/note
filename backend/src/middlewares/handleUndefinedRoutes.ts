import { Context, Next } from 'koa';
import {sendErrorResponse} from "../helpers/responseHelper";

const handleUndefinedRoutes = async (ctx: Context, next: Next) => {
        try {
            await next(); // 继续处理下一个中间件
            // 如果没有找到匹配的路由，则抛出 404 错误
            if (ctx.status === 404) {
                sendErrorResponse(ctx, 404, `${ctx.request.method} ${ctx.request.url} Not Found`)
            }
        } catch (error: any) {
            sendErrorResponse(ctx, error.status, error.message)
        }
};

export default handleUndefinedRoutes;
