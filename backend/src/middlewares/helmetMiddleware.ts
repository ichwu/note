import helmet from 'koa-helmet';
import { Middleware } from 'koa';

// 定义 Helmet 中间件
const helmetMiddleware: Middleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https:", "data:"],
            imgSrc: ["'self'", "data:"],
            frameSrc: ["'self'"],
        },
    },
    // 其他 Helmet 配置
});

export default helmetMiddleware;
