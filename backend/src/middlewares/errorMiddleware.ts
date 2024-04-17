import Koa from 'koa';

class APIError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorMiddleware: Koa.Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof APIError) {
            // 如果是 APIError 类型的错误，返回错误信息
            ctx.status = err.status;
            ctx.body = { error: err.message };
        } else {
            // 否则，返回 500 Internal Server Error
            ctx.status = 500;
            ctx.body = { error: 'Internal Server Error' };
            // 在生产环境下可以记录错误日志
            console.error(err);
        }
    }
};

export default errorMiddleware;
