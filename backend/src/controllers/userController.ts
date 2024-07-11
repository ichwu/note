import { paginate } from '../utils/paginate'; // 导入分页函数
import { IUser, User } from '../models/User'; // 导入用户模型和接口
import { sendSuccessResponse, sendErrorResponse } from '../helpers/responseHelper'; // 导入成功和失败响应函数

interface QueryParams {
    [key: string]: any; // 定义查询参数类型，允许任意键和任意值
}

const userController = {
    // 获取所有用户的控制器方法
    getAllUsers: async (ctx: any) => {
        const queryParams: QueryParams = {};
        // 如果请求中包含用户名参数，则设置模糊查询条件
        if (ctx.query.username) {
            queryParams['username'] = { $regex: new RegExp(ctx.query.username, 'i') };
        }

        try {
            // 使用 paginate 函数对用户模型进行分页查询
            const { data, pagination } = await paginate<IUser>(User, ctx, queryParams);
            // 发送成功响应，返回分页数据和查询结果
            sendSuccessResponse(ctx, { pagination, rows: data });
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    // 根据用户 ID 获取用户信息的控制器方法
    getUserById: async (ctx: any) => {
        const userId = ctx.params.id; // 获取请求参数中的用户 ID
        try {
            // 根据用户 ID 查询用户信息
            const result = await User.findById(userId);
            // 如果未找到用户，则发送 404 错误响应
            if (!result) {
                sendErrorResponse(ctx, 404, 'User not found');
                return;
            }
            // 发送成功响应，返回查询到的用户信息
            sendSuccessResponse(ctx, { result });
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    // 更新用户信息的控制器方法
    updateUser: async (ctx: any) => {
        const userId = ctx.params.id; // 获取请求参数中的用户 ID
        const userData = ctx.request.body; // 获取请求体中的更新数据
        try {
            // 根据用户 ID 查询要更新的用户信息
            const user = await User.findById(userId);
            // 如果未找到用户，则发送 404 错误响应
            if (!user) {
                sendErrorResponse(ctx, 404, 'User not found');
                return;
            }
            // 如果更新数据中包含用户名，则检查是否已存在同名用户
            if (userData.username) {
                const existingUser = await User.findOne({ username: userData.username });
                // 如果存在同名用户且 ID 不同，则发送 400 错误响应
                if (existingUser && existingUser.id !== userId) {
                    sendErrorResponse(ctx, 400, 'Username already exists');
                    return;
                }
            }
            // 如果更新数据中包含邮箱，则检查是否已存在同邮箱用户
            if (userData.email) {
                const existingUser = await User.findOne({ email: userData.email });
                // 如果存在同邮箱用户且 ID 不同，则发送 400 错误响应
                if (existingUser && existingUser.id !== userId) {
                    sendErrorResponse(ctx, 400, 'Email already exists');
                    return;
                }
            }
            // 更新用户信息
            user.username = userData.username || user.username;
            user.email = userData.email || user.email;
            // 保存更新后的用户信息到数据库
            await user.save();
            // 发送成功响应，返回更新后的用户信息
            sendSuccessResponse(ctx, { user });
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    // 删除用户的控制器方法
    deleteUser: async (ctx: any) => {
        const userId = ctx.params.id; // 获取请求参数中的用户 ID
        try {
            // 根据用户 ID 删除用户信息
            const result = await User.deleteOne({ _id: userId });
            // 发送成功响应，返回删除操作的结果
            sendSuccessResponse(ctx, { result });
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    }
};

export default userController; // 导出用户控制器对象
