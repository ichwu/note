"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paginate_1 = require("../utils/paginate"); // 导入分页函数
const User_1 = require("../models/User"); // 导入用户模型和接口
const responseHelper_1 = require("../helpers/responseHelper");
const userService_1 = require("../services/userService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nanoid_1 = require("nanoid"); // 导入成功和失败响应函数
const userController = {
    /** 获取所有用户 **/
    getAllUsers: async (ctx) => {
        const queryParams = {};
        // 如果请求中包含参数，则设置模糊查询条件
        if (ctx.query.username) {
            queryParams['username'] = { $regex: new RegExp(ctx.query.username, 'i') };
        }
        try {
            // 使用 paginate 函数对用户模型进行分页查询
            const { data, pagination } = await (0, paginate_1.paginate)(User_1.User, ctx, queryParams);
            // 发送成功响应，返回分页数据和查询结果
            (0, responseHelper_1.sendSuccessResponse)(ctx, { pagination, rows: data });
        }
        catch (error) {
            // 捕获数据库操作中的错误，并发送错误响应
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    /** 添加用户 **/
    addUser: async (ctx) => {
        const { username, password, email } = ctx.request.body;
        // 判断用户名是否已存在
        if (await (0, userService_1.findUserByUsername)(username)) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 400, 'Username already exists');
            return;
        }
        // 判断邮箱是否已存在
        if (await (0, userService_1.findUserByEmail)(email)) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 400, 'Email already exists');
            return;
        }
        try {
            // 使用 bcrypt 对密码进行哈希处理
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            // 将用户名、哈希后的密码和邮箱存储到数据库中
            await (0, userService_1.createUser)({
                id: (0, nanoid_1.nanoid)(10),
                username,
                password: hashedPassword,
                email,
                role: username === 'admin' ? 'admin' : 'user'
            });
            // 发送成功响应
            (0, responseHelper_1.sendSuccessResponse)(ctx);
        }
        catch (error) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    /** 获取用户详情 **/
    getUserDetail: async (ctx) => {
        try {
            // 根据用户名查询用户信息
            const username = ctx.state.user.username;
            const user = await User_1.User.findOne({ username: username });
            // 如果未找到用户，则发送 404 错误响应
            if (!user) {
                (0, responseHelper_1.sendErrorResponse)(ctx, 404, 'User not found');
                return;
            }
            // 发送成功响应，返回查询到的用户信息
            (0, responseHelper_1.sendSuccessResponse)(ctx, user);
        }
        catch (error) {
            // 捕获数据库操作中的错误，并发送错误响应
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    /** 更新用户 **/
    updateUser: async (ctx) => {
        const userData = ctx.request.body; // 获取请求体中的更新数据
        try {
            // 根据用户名查询用户信息
            const id = userData.id;
            const user = await User_1.User.findOne({ id });
            // 如果未找到用户，则发送 404 错误响应
            if (!user) {
                (0, responseHelper_1.sendErrorResponse)(ctx, 404, 'User not found');
                return;
            }
            // 如果更新数据中包含用户名，则检查是否已存在同名用户
            if (userData.username) {
                const existingUsers = await User_1.User.find({ username: userData.username });
                // 如果存在同名用户且 ID 不同，则发送 400 错误响应
                if (existingUsers && existingUsers.some(u => u.id !== user.id)) {
                    (0, responseHelper_1.sendErrorResponse)(ctx, 400, 'Username already exists');
                    return;
                }
            }
            // 如果更新数据中包含邮箱，则检查是否已存在同邮箱用户
            if (userData.email) {
                const existingUsers = await User_1.User.find({ email: userData.email });
                // 如果存在同邮箱用户且 ID 不同，则发送 400 错误响应
                if (existingUsers && existingUsers.some(u => u.id !== user.id)) {
                    (0, responseHelper_1.sendErrorResponse)(ctx, 400, 'Email already exists');
                    return;
                }
            }
            // 更新用户信息
            delete userData.id;
            delete userData.password;
            Object.assign(user, userData);
            // 保存更新后的用户信息到数据库
            await user.save();
            // 发送成功响应，返回更新后的用户信息
            (0, responseHelper_1.sendSuccessResponse)(ctx, user);
        }
        catch (error) {
            // 捕获数据库操作中的错误，并发送错误响应
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    /** 删除用户 **/
    deleteUser: async (ctx) => {
        const ids = ctx.params.ids; // 获取请求参数中的用户 ID
        try {
            // 根据用户 ID 删除用户信息
            const result = await User_1.User.deleteMany({ id: { $in: ids.split(',').map((i) => i.trim()) } });
            // 发送成功响应，返回删除操作的结果
            (0, responseHelper_1.sendSuccessResponse)(ctx, result);
        }
        catch (error) {
            // 捕获数据库操作中的错误，并发送错误响应
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    }
};
exports.default = userController; // 导出用户控制器对象
