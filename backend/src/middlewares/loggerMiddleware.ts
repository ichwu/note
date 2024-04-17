import winston from 'winston';
import {Context, Next} from 'koa'

// 配置 winston 日志记录器
const loggerMiddleware = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log'}),
    ],
});

// 如果不是生产环境，则添加到控制台输出
if (process.env.NODE_ENV !== 'production') {
    loggerMiddleware.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export default async (ctx: Context, next: Next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    loggerMiddleware.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
};
