import {Context} from 'koa'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {findUserByEmail, findUserByUsername, createUser} from '../services/userService'
import {addToBlacklist} from "../services/tokenBlockListService";
import { sendSuccessResponse, sendErrorResponse } from '../helpers/responseHelper'

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
            sendErrorResponse(ctx, 400, 'Username already exists')
            return;
        }

        // 判断邮件是否存在
        if (await findUserByEmail(email)) {
            sendErrorResponse(ctx, 400, 'Email already exists')
            return;
        }

        try {
            // 使用 bcrypt 对密码进行哈希处理
            const hashedPassword = await bcrypt.hash(password, 10);
            // 将用户名和哈希后的密码存储到数据库中
            await createUser({
                username, password: hashedPassword, email
            })
            sendSuccessResponse(ctx)
        } catch (error) {
            sendErrorResponse(ctx, 500, 'Internal Server Error')
        }
    },
    login: async (ctx: Context) => {
        const {username, password} = ctx.request.body as LoginRequestBody;
        // 判断用户名是否存在
        const user = await findUserByUsername(username);
        if (!user) {
            sendErrorResponse(ctx, 400, 'Invalid username or password')
            return;
        }

        // 使用 bcryptjs 验证密码是否正确
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            sendErrorResponse(ctx, 401, 'Invalid username or password')
            return;
        }
        try {
            const token = jwt.sign({username}, secret, {expiresIn: '3d'});
            sendSuccessResponse(ctx, token)
        } catch (error) {
            sendErrorResponse(ctx, 500, 'Internal Server Error')
        }
    },
    logout: async (ctx: Context) => {
        try {
            // 清除客户端保存的 JWT，如果存储在 Cookie 中，也可以通过设置 Cookie 的过期时间来清除
            const token = ctx.request.headers.authorization?.split(' ')[1] || '';
            const time = ctx.state.user?.exp || new Date().getTime()
            await addToBlacklist(token, new Date(time * 1000))
            sendSuccessResponse(ctx, ctx.state.user)
        } catch (error) {
            sendErrorResponse(ctx, 401, 'Invalid or expired token')
        }
    }
};

export default authController;
