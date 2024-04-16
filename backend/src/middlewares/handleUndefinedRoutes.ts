import { Context, Next } from 'koa';

const handleUndefinedRoutes = async (ctx: Context, next: Next) => {
        try {
            await next(); // 继续处理下一个中间件
            // 如果没有找到匹配的路由，则抛出 404 错误
            if (ctx.status === 404) {
                ctx.status = 404;
                ctx.body = {error: 'Not Found'};
            }
        } catch (err: any) {
            ctx.status = 500; // 设置 HTTP 状态码为 500，表示服务器错误
            ctx.body = {error: 'Internal Server Error'};
        }
};

export default handleUndefinedRoutes;
