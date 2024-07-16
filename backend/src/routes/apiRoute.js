"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const swaggerMiddleware_1 = require("../middlewares/swaggerMiddleware");
const router = new koa_router_1.default();
// 设置路由处理程序来返回 OpenAPI 规范
router.get('/openapi', (ctx) => {
    ctx.body = swaggerMiddleware_1.swaggerSpec;
});
exports.default = router;
