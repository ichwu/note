import {Context, Next} from 'koa';
import {ObjectSchema, ValidationError} from 'joi';
import {sendErrorResponse} from "../helpers/responseHelper";

/** 通用的校验中间件 **/
const validateMiddleware = (schema: ObjectSchema) => {
    return async (ctx: Context, next: Next) => {
        try {
            // 校验请求体中的字段
            ctx.request.body = await schema.validateAsync(ctx.request.body); // 更新请求体为校验后的数据
            await next();
        } catch (error) {
            // 使用类型断言告诉 TypeScript error 的确切类型
            const validationError = error as ValidationError;
            const details = validationError.details || [];
            const errorMessage = details.length > 0 ? details[0].message : '校验失败';
            sendErrorResponse(ctx, 400, errorMessage)
        }
    };
};

export default validateMiddleware

