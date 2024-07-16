"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const userController_1 = __importDefault(require("../controllers/userController"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const user_1 = require("../rules/user");
const userRouter = new koa_router_1.default();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 用户相关的 API
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: 获取所有用户
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 成功获取所有用户
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60c72b2f9b1d8a001c8e4b9f"
 *                   username:
 *                     type: string
 *                     example: "admin"
 *                   email:
 *                     type: string
 *                     example: "admin@example.com"
 *                   role:
 *                     type: string
 *                     example: "admin"
 */
userRouter.get('/users', userController_1.default.getAllUsers);
/**
 * @swagger
 * /user:
 *   post:
 *     summary: 添加用户
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "newuser"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *     responses:
 *       201:
 *         description: 用户添加成功
 *       400:
 *         description: 请求体验证失败
 */
userRouter.post('/user', (0, validationMiddleware_1.default)(user_1.userAddSchema), userController_1.default.addUser);
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: 获取用户详情
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户的唯一 ID
 *     responses:
 *       200:
 *         description: 成功获取用户详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60c72b2f9b1d8a001c8e4b9f"
 *                 username:
 *                   type: string
 *                   example: "admin"
 *                 email:
 *                   type: string
 *                   example: "admin@example.com"
 *                 role:
 *                   type: string
 *                   example: "admin"
 *       404:
 *         description: 用户未找到
 */
userRouter.get('/user/:id', userController_1.default.getUserDetail);
/**
 * @swagger
 * /user:
 *   put:
 *     summary: 更新用户信息
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "60c72b2f9b1d8a001c8e4b9f"
 *               username:
 *                 type: string
 *                 example: "updateduser"
 *               email:
 *                 type: string
 *                 example: "updateduser@example.com"
 *     responses:
 *       200:
 *         description: 用户信息更新成功
 *       400:
 *         description: 请求体验证失败
 */
userRouter.put('/user', (0, validationMiddleware_1.default)(user_1.userUpdateSchema), userController_1.default.updateUser);
/**
 * @swagger
 * /user/{ids}:
 *   delete:
 *     summary: 删除用户
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户的 ID 列表，多个 ID 用逗号分隔
 *     responses:
 *       200:
 *         description: 用户删除成功
 *       400:
 *         description: 请求格式错误
 */
userRouter.delete('/user/:ids', userController_1.default.deleteUser);
exports.default = userRouter;
