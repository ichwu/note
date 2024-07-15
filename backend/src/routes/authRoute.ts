import Router from 'koa-router';
import authController from '../controllers/authController';
import {validateMiddleware, loginSchema, userAddSchema} from '../middlewares/validationMiddleware'
import userController from "../controllers/userController";

const router = new Router();

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
router.post('/login', validateMiddleware(loginSchema), authController.login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: 用户注册
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
router.post('/register', validateMiddleware(userAddSchema), userController.addUser);

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
router.post('/logout', authController.logout);

export default router;
