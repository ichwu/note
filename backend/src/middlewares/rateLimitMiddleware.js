"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_ratelimit_1 = __importDefault(require("koa-ratelimit"));
var rateLimitMiddleware = (0, koa_ratelimit_1.default)({
    driver: 'memory',
    db: new Map(),
    duration: 60000,
    errorMessage: 'Too many requests, please try again later.',
    id: function (ctx) { return ctx.ip; },
    headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false,
});
exports.default = rateLimitMiddleware;
