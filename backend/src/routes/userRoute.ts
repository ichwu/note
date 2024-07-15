import Router from 'koa-router';
import userController from '../controllers/userController';
import {validateMiddleware, userUpdateSchema, userAddSchema} from "../middlewares/validationMiddleware";

const userRouter = new Router();

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
userRouter.get('/users', userController.getAllUsers);

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
userRouter.post('/user', validateMiddleware(userAddSchema), userController.addUser);

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
userRouter.get('/user/:id', userController.getUserDetail);

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
userRouter.put('/user', validateMiddleware(userUpdateSchema), userController.updateUser);

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
userRouter.delete('/user/:ids', userController.deleteUser);

export default userRouter;
