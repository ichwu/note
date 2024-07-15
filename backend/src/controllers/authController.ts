import { Context } from 'koa'; // 导入 Koa 的 Context 类型
import jwt from 'jsonwebtoken'; // 导入 JWT 模块
import bcrypt from 'bcryptjs'; // 导入 bcrypt 模块
import { findUserByEmail, findUserByUsername, createUser } from '../services/userService'; // 导入用户服务函数
import { addToBlocklist } from '../services/tokenBlocklistService'; // 导入令牌黑名单服务函数
import { sendSuccessResponse, sendErrorResponse } from '../helpers/responseHelper'; // 导入成功和失败响应函数
import { nanoid } from "nanoid";

const secret = process.env.TOKEN_SECRET || 'your-secret-key'; // 设置 JWT 密钥，默认为 'your-secret-key'

// 定义登录请求体接口
interface LoginRequestBody {
    username: string;
    password: string;
}

// 定义注册请求体接口
interface RegisterRequestBody {
    username: string;
    password: string;
    email: string;
}

const authController = {

    // 用户登录的控制器方法
    login: async (ctx: Context) => {
        const { username, password } = ctx.request.body as LoginRequestBody;

        // 根据用户名查询用户信息
        const user = await findUserByUsername(username);
        // 如果未找到用户，发送 400 错误响应
        if (!user) {
            sendErrorResponse(ctx, 400, 'Invalid username or password');
            return;
        }

        // 使用 bcryptjs 验证密码是否正确
        const passwordMatch = await bcrypt.compare(password, user.password);
        // 如果密码不匹配，发送 401 错误响应
        if (!passwordMatch) {
            sendErrorResponse(ctx, 401, 'Invalid username or password');
            return;
        }

        try {
            // 生成 JWT 并设置过期时间为 3 天
            const token = jwt.sign({ username }, secret, { expiresIn: '3d' });
            // 发送成功响应，返回生成的 token
            sendSuccessResponse(ctx, { token });
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    // 用户登出的控制器方法
    logout: async (ctx: Context) => {
        try {
            // 获取请求头中的 Authorization，并提取 token
            const token = ctx.request.headers.authorization?.split(' ')[1] || '';
            // 获取当前用户的过期时间，若不存在则使用当前时间戳
            const time = ctx.state.user?.exp || Date.now();
            // 将 token 添加至黑名单，并设置过期时间
            await addToBlocklist(token, new Date(time * 1000));
            // 发送成功响应，返回当前用户信息
            sendSuccessResponse(ctx, ctx.state.user);
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },
};

export default authController; // 导出用户认证控制器对象
