import {paginate} from '../utils/paginate'; // 导入分页函数
import {IUser, User} from '../models/User'; // 导入用户模型和接口
import {sendSuccessResponse, sendErrorResponse} from '../helpers/responseHelper';
import {Context} from "koa";
import {createUser, findUserByEmail, findUserByUsername} from "../services/userService";
import bcrypt from "bcryptjs";
import {nanoid} from "nanoid"; // 导入成功和失败响应函数

interface QueryParams {
    [key: string]: any; // 定义查询参数类型，允许任意键和任意值
}

const userController = {
    /** 获取所有用户 **/
    getAllUsers: async (ctx: any) => {
        const queryParams: QueryParams = {};
        // 如果请求中包含用户名参数，则设置模糊查询条件
        if (ctx.query.username) {
            queryParams['username'] = {$regex: new RegExp(ctx.query.username, 'i')};
        }

        try {
            // 使用 paginate 函数对用户模型进行分页查询
            const {data, pagination} = await paginate<IUser>(User, ctx, queryParams);
            // 发送成功响应，返回分页数据和查询结果
            sendSuccessResponse(ctx, {pagination, rows: data});
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    /** 添加用户 **/
    addUser: async (ctx: any) => {
        const { username, password, email } = ctx.request.body;

        // 判断用户名是否已存在
        if (await findUserByUsername(username)) {
            sendErrorResponse(ctx, 400, 'Username already exists');
            return;
        }

        // 判断邮箱是否已存在
        if (await findUserByEmail(email)) {
            sendErrorResponse(ctx, 400, 'Email already exists');
            return;
        }

        try {
            // 使用 bcrypt 对密码进行哈希处理
            const hashedPassword = await bcrypt.hash(password, 10);
            // 将用户名、哈希后的密码和邮箱存储到数据库中
            await createUser({
                id: nanoid(10),
                username,
                password: hashedPassword,
                email,
                role: username === 'admin' ? 'admin' : 'user' });
            // 发送成功响应
            sendSuccessResponse(ctx);
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    /** 获取用户详情 **/
    getUserDetail: async (ctx: any) => {
        try {
            // 根据用户名查询用户信息
            const username = ctx.state.user.username
            const user = await User.findOne({username: username});
            // 如果未找到用户，则发送 404 错误响应
            if (!user) {
                sendErrorResponse(ctx, 404, 'User not found');
                return;
            }
            // 发送成功响应，返回查询到的用户信息
            sendSuccessResponse(ctx, user);
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    /** 更新用户 **/
    updateUser: async (ctx: any) => {
        const userData = ctx.request.body; // 获取请求体中的更新数据
        try {
            // 根据用户名查询用户信息
            const id = userData.id
            const user = await User.findOne({ id });
            // 如果未找到用户，则发送 404 错误响应
            if (!user) {
                sendErrorResponse(ctx, 404, 'User not found');
                return;
            }
            // 如果更新数据中包含用户名，则检查是否已存在同名用户
            if (userData.username) {
                const existingUsers = await User.find({username: userData.username});
                // 如果存在同名用户且 ID 不同，则发送 400 错误响应
                if (existingUsers && existingUsers.some(u => u.id !== user.id)) {
                    sendErrorResponse(ctx, 400, 'Username already exists');
                    return;
                }
            }
            // 如果更新数据中包含邮箱，则检查是否已存在同邮箱用户
            if (userData.email) {
                const existingUsers = await User.find({email: userData.email});
                // 如果存在同邮箱用户且 ID 不同，则发送 400 错误响应
                if (existingUsers && existingUsers.some(u => u.id !== user.id)) {
                    sendErrorResponse(ctx, 400, 'Email already exists');
                    return;
                }
            }
            // 更新用户信息
            delete userData.id;
            delete userData.password;
            Object.assign(user, userData)
            // 保存更新后的用户信息到数据库
            await user.save();
            // 发送成功响应，返回更新后的用户信息
            sendSuccessResponse(ctx, user);
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    /** 删除用户 **/
    deleteUser: async (ctx: any) => {
        const ids = ctx.params.ids; // 获取请求参数中的用户 ID
        try {
            // 根据用户 ID 删除用户信息
            const result = await User.deleteMany({id: {$in: ids.split(',').map((i: string) => i.trim())}});
            // 发送成功响应，返回删除操作的结果
            sendSuccessResponse(ctx, result);
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    }
};

export default userController; // 导出用户控制器对象
