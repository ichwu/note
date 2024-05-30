import Router from 'koa-router';
import authController from '../controllers/authController';
import { validateMiddleware, loginSchema, registerSchema } from '../middlewares/validationMiddleware'

const authRouter = new Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 用户登录
 *     description: 用户登录接口
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登录成功
 *       401:
 *         description: 用户名或密码错误
 */
authRouter.post('/login', validateMiddleware(loginSchema), authController.login);
/**
 * @swagger
 * /register:
 *   post:
 *     summary: 用户注册
 *     description: 用户注册接口
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 注册成功
 *       400:
 *         description: 注册信息无效
 */
authRouter.post('/register', validateMiddleware(registerSchema), authController.register);
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 用户注销
 *     description: 用户注销接口
 *     responses:
 *       200:
 *         description: 注销成功
 *       401:
 *         description: 用户未登录
 */
authRouter.post('/logout', authController.logout);

export default authRouter;
