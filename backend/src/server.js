"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken_1 = require("./middlewares/verifyToken");
const app = new koa_1.default();
const router = new koa_router_1.default();
// 处理表单提交
app.use((0, koa_bodyparser_1.default)());
// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    console.log('set X-Response-Time');
});
const secret = 'your-secret-key'; // 生成和验证JWT的密钥，应该从环境变量或配置中获取
// Middleware to intercept requests and check JWT token
app.use((0, verifyToken_1.verifyToken)(secret).unless({
    path: [/^\/public/, '/login', '/logout']
}));
// 登录路由
router.post('/login', async (ctx) => {
    const { username, password } = ctx.request.body;
    // 这里应该有逻辑来验证用户名和密码
    if (username === 'admin' && password === 'password') {
        const token = jsonwebtoken_1.default.sign({ username }, secret, { expiresIn: '1h' });
        ctx.body = { message: '登录成功', token };
    }
    else {
        ctx.status = 401;
        ctx.body = { message: 'Authentication Failed' };
    }
});
app.use(router.routes()).use(router.allowedMethods());
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
