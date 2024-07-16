"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
/** 需要放到开头，以免调用和定义 secret 的值不一致 **/
dotenv_1.default.config();
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var koa_1 = __importDefault(require("koa"));
var koa_router_1 = __importDefault(require("koa-router"));
var koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
var cors_1 = __importDefault(require("@koa/cors"));
var database_1 = __importDefault(require("./database"));
var koa_compress_1 = __importDefault(require("koa-compress"));
var koa_static_1 = __importDefault(require("koa-static"));
var authMiddleware_1 = require("./middlewares/authMiddleware");
var responseTimeMiddleware_1 = __importDefault(require("./middlewares/responseTimeMiddleware"));
var handleUndefinedRoutes_1 = __importDefault(require("./middlewares/handleUndefinedRoutes"));
var loggerMiddleware_1 = __importDefault(require("./middlewares/loggerMiddleware"));
var errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
var rateLimitMiddleware_1 = __importDefault(require("./middlewares/rateLimitMiddleware"));
var swaggerMiddleware_1 = __importDefault(require("./middlewares/swaggerMiddleware"));
var helmetMiddleware_1 = __importDefault(require("./middlewares/helmetMiddleware"));
var app = new koa_1.default();
var router = new koa_router_1.default();
// 连接数据库
(0, database_1.default)();
// 使用错误中间件
app.use(errorMiddleware_1.default);
// 使用 helmet 中间件增强安全性
app.use(helmetMiddleware_1.default);
// 设置跨域
app.use((0, cors_1.default)());
// 处理表单提交
app.use((0, koa_bodyparser_1.default)());
// 响应时间中间件
app.use(responseTimeMiddleware_1.default);
// 日志中间件
app.use(loggerMiddleware_1.default);
// 响应压缩
app.use((0, koa_compress_1.default)());
// 添加限流中间件，防止DDOS攻击
app.use(rateLimitMiddleware_1.default);
// 静态文件服务
app.use((0, koa_static_1.default)('./public'));
// 使用 Swagger 中间件
app.use(swaggerMiddleware_1.default);
// 添加 token 拦截中间件
app.use(authMiddleware_1.tokenInterceptorErrorMiddleware)
    .use(authMiddleware_1.tokenInterceptorWhiteListMiddleware)
    .use(authMiddleware_1.tokenInterceptorBlackListMiddleware);
// 批量导入 routes 目录下的路由
var routesPath = path_1.default.join(__dirname, 'routes');
fs_1.default.readdirSync(routesPath).forEach(function (file) {
    if (file.endsWith('.ts')) {
        var route = require(path_1.default.join(routesPath, file)).default;
        app.use(route.routes());
    }
});
// 使用处理未定义的接口的中间件
app.use(handleUndefinedRoutes_1.default);
// 将路由中间件添加到应用中
app.use(router.routes()).use(router.allowedMethods());
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
