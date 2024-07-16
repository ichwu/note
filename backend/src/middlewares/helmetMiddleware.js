"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_helmet_1 = __importDefault(require("koa-helmet"));
// 定义 Helmet 中间件
var helmetMiddleware = (0, koa_helmet_1.default)({
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
exports.default = helmetMiddleware;
