import Koa from 'koa';
import { sendErrorResponse } from "../helpers/responseHelper";

const errorMiddleware: Koa.Middleware = async (ctx, next) => {
    try {
        await next();
    } catch (error: any) {
        sendErrorResponse(ctx, error.status, error.message)
    }
};

export default errorMiddleware;
