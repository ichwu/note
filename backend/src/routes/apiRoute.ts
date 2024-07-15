import Router from "koa-router";
import { swaggerSpec } from "../middlewares/swaggerMiddleware";

const router = new Router();

// 设置路由处理程序来返回 OpenAPI 规范
router.get('/openapi', (ctx) => {
    ctx.body = swaggerSpec;
});

export default router;
