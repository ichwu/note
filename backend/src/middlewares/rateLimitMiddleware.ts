import ratelimit from 'koa-ratelimit';
import { Middleware } from 'koa';

const rateLimitMiddleware: Middleware = ratelimit({
    driver: 'memory',
    db: new Map(),
    duration: 60000,
    errorMessage: 'Too many requests, please try again later.',
    id: (ctx) => ctx.ip,
    headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false,
});

export default rateLimitMiddleware;
