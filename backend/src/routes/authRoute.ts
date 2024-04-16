import Router from 'koa-router';
import authController from '../controllers/authController';
import { validateMiddleware, loginSchema, registerSchema } from '../middlewares/validationMiddleware'

const authRouter = new Router();

authRouter.post('/login', validateMiddleware(loginSchema), authController.login);
authRouter.post('/register', validateMiddleware(registerSchema), authController.register);
authRouter.post('/logout', authController.logout);

export default authRouter;
