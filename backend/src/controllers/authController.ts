import {Context} from 'koa'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {findUserByEmail, findUserByUsername, createUser} from '../services/userService'
import { addToBlacklist } from "../services/tokenBlockListService";

const secret = process.env.TOKEN_SECRET || 'your-secret-key'

interface LoginRequestBody {
    username: string,
    password: string,
}

interface RegisterRequestBody {
    username: string,
    password: string,
    email: string,
}

const authController = {
    register: async (ctx: Context) => {
        const {username, password, email} = ctx.request.body as RegisterRequestBody;
        // 判断用户名是否存在
        if (await findUserByUsername(username)) {
            ctx.status = 400;
            ctx.body = {error: 'Username already exists'};
            return;
        }

        // 判断邮件是否存在
        if (await findUserByEmail(email)) {
            ctx.status = 400;
            ctx.body = {error: 'Email already exists'};
            return;
        }

        try {
            // 使用 bcrypt 对密码进行哈希处理
            const hashedPassword = await bcrypt.hash(password, 10);
            // 将用户名和哈希后的密码存储到数据库中
            await createUser({
                username, password: hashedPassword, email
            })
            ctx.status = 201;
            ctx.body = {message: 'success'};
        } catch (error) {
            ctx.status = 500;
            ctx.body = {error: 'Internal Server Error'};
        }
    },
    login: async (ctx: Context) => {
        const {username, password} = ctx.request.body as LoginRequestBody;
        // 判断用户名是否存在
        const user = await findUserByUsername(username);
        if (!user) {
            ctx.status = 400;
            ctx.body = {error: 'Invalid username or password'};
            return;
        }

        // 使用 bcryptjs 验证密码是否正确
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            ctx.status = 401;
            ctx.body = {error: 'Invalid username or password'};
            return;
        }
        try {
            const token = jwt.sign({username}, secret, {expiresIn: 90 * 1000});
            ctx.body = {message: 'Login successfully', token};
        } catch (error) {
            ctx.status = 500;
            ctx.body = {error: 'Internal Server Error'};
        }
    },
    logout: async (ctx: Context) => {
        try {
            // 清除客户端保存的 JWT
            // 这里假设客户端将 JWT 存储在本地存储中
            // 如果存储在 Cookie 中，也可以通过设置 Cookie 的过期时间来清除
            // 或者使用其他方式清除客户端的 JWT
            // clearClientToken(decoded.userId);
            const token = ctx.state.token
            const time = ctx.state.user?.exp || new Date().getTime()
            await  addToBlacklist(token, new Date(time * 1000))
            ctx.body = {message: 'Logout successful', info: ctx.state.user};
        } catch (error) {
            console.log(error)
            ctx.status = 401;
            ctx.body = {error: 'Invalid or expired token', };
        }
    }
};

export default authController;
