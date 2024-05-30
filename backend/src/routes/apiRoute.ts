import Router from "koa-router";
import { swaggerSpec } from "../middlewares/swaggerMiddleware";

const swaggerRouter = new Router();

// 设置路由处理程序来返回 OpenAPI 规范
swaggerRouter.get('/openapi', (ctx) => {
    ctx.body = swaggerSpec;
});

export default swaggerRouter;
