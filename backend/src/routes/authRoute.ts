import Router from 'koa-router';
import authController from '../controllers/authController';
import { validateMiddleware, loginSchema } from '../middlewares/validationMiddleware'

const authRouter = new Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: 用户认证相关的 API
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 用户登录
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       400:
 *         description: 请求体验证失败
 *       401:
 *         description: 用户名或密码错误
 */
authRouter.post('/login', validateMiddleware(loginSchema), authController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 用户登出
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: 登出成功
 *       401:
 *         description: 用户未登录或无效的会话
 */
authRouter.post('/logout', authController.logout);

export default authRouter;
