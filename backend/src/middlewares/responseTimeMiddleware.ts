import { Context, Next } from 'koa';

const responseTimeMiddleware = async (ctx: Context, next: Next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
};

export default responseTimeMiddleware;
