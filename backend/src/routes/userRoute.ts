import Router from 'koa-router';
import userController from '../controllers/userController';
import authController from "../controllers/authController";
import {validateMiddleware, userUpdateSchema, registerSchema} from "../middlewares/validationMiddleware";

const userRouter = new Router();

userRouter.get('/users', userController.getAllUsers);
userRouter.get('/user/:id', userController.getUserById);
userRouter.put('/user/:id', validateMiddleware(userUpdateSchema), userController.updateUser);
userRouter.delete('/user/:id', userController.deleteUser);
userRouter.post('/user', validateMiddleware(registerSchema), authController.register);

export default userRouter;
