import { paginate } from '../utils/paginate'
import { IUser, User } from '../models/User';

const userController = {
    getAllUsers: async (ctx: any) => {
        // 处理模糊查询
        interface QueryParams {
            [key: string]: any;
        }

        const queryParams: QueryParams = {};
        if (ctx.query.username) {
            queryParams['username'] = { $regex: new RegExp(ctx.query.username, 'i') }; // 使用正则表达式进行模糊匹配
        }

        try {
            const { data, pagination } = await paginate<IUser>(User, ctx, queryParams
            );
            ctx.body = { message: 'Success', pagination, data };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'Internal Server Error' };
        }
    },
    getUserById: async (ctx: any) => {
        // 处理获取特定用户的逻辑
        const userId = ctx.params.id;
        try {
            const result = await User.findById(userId)
            ctx.body = { message: `Get user with id ${userId}`, result };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'Internal Server Error' };
        }
    },
    updateUser: async (ctx: any) => {
        const userId = ctx.params.id;
        const userData = ctx.request.body;

        try {
            // 查找要更新的用户
            const user = await User.findById(userId);
            if (!user) {
                ctx.status = 404;
                ctx.body = { error: 'User not found' };
                return;
            }

            // 检查新的用户名是否已存在
            if (userData.username) {
                const existingUser = await User.findOne({ username: userData.username });
                if (existingUser && existingUser.id !== userId) {
                    ctx.status = 400;
                    ctx.body = { error: 'Username already exists' };
                    return;
                }
            }

            // 检查新的邮箱是否已存在
            if (userData.email) {
                const existingUser = await User.findOne({ email: userData.email });
                if (existingUser && existingUser.id !== userId) {
                    ctx.status = 400;
                    ctx.body = { error: 'Email already exists' };
                    return;
                }
            }

            // 更新用户数据
            user.username = userData.username || user.username;
            user.email = userData.email || user.email;

            // 保存更新后的用户数据
            await user.save();

            ctx.status = 200;
            ctx.body = { message: 'User updated successfully', user };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'Internal Server Error' };
        }
    },
    deleteUser: async (ctx: any) => {
        // 处理删除用户的逻辑
        const userId = ctx.params.id;
        try {
            const result = await User.deleteOne({_id: userId})
            ctx.body = { message: `Delete user with id ${userId}`, result };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: 'Internal Server Error' };
        }
    }
};

export default userController;
