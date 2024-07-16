"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // 导入 JWT 模块
const bcryptjs_1 = __importDefault(require("bcryptjs")); // 导入 bcrypt 模块
const userService_1 = require("../services/userService"); // 导入用户服务函数
const tokenBlocklistService_1 = require("../services/tokenBlocklistService"); // 导入令牌黑名单服务函数
const responseHelper_1 = require("../helpers/responseHelper"); // 导入成功和失败响应函数
const secret = process.env.TOKEN_SECRET || 'your-secret-key'; // 设置 JWT 密钥，默认为 'your-secret-key'
const authController = {
    // 用户登录的控制器方法
    login: async (ctx) => {
        const { username, password } = ctx.request.body;
        // 根据用户名查询用户信息
        const user = await (0, userService_1.findUserByUsername)(username);
        // 如果未找到用户，发送 400 错误响应
        if (!user) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 400, 'Invalid username or password');
            return;
        }
        // 使用 bcryptjs 验证密码是否正确
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        // 如果密码不匹配，发送 401 错误响应
        if (!passwordMatch) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 401, 'Invalid username or password');
            return;
        }
        try {
            // 生成 JWT 并设置过期时间为 3 天
            const token = jsonwebtoken_1.default.sign({ username }, secret, { expiresIn: '3d' });
            // 发送成功响应，返回生成的 token
            (0, responseHelper_1.sendSuccessResponse)(ctx, { token });
        }
        catch (error) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    // 用户登出的控制器方法
    logout: async (ctx) => {
        try {
            // 获取请求头中的 Authorization，并提取 token
            const token = ctx.request.headers.authorization?.split(' ')[1] || '';
            // 获取当前用户的过期时间，若不存在则使用当前时间戳
            const time = ctx.state.user?.exp || Date.now();
            // 将 token 添加至黑名单，并设置过期时间
            await (0, tokenBlocklistService_1.addToBlocklist)(token, new Date(time * 1000));
            // 发送成功响应，返回当前用户信息
            (0, responseHelper_1.sendSuccessResponse)(ctx, ctx.state.user);
        }
        catch (error) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
};
exports.default = authController; // 导出用户认证控制器对象
