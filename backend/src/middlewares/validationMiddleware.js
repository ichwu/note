"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = require("../helpers/responseHelper");
/** 通用的校验中间件 **/
const validateMiddleware = (schema) => {
    return async (ctx, next) => {
        try {
            // 校验请求体中的字段
            ctx.request.body = await schema.validateAsync(ctx.request.body); // 更新请求体为校验后的数据
            await next();
        }
        catch (error) {
            // 使用类型断言告诉 TypeScript error 的确切类型
            const validationError = error;
            const details = validationError.details || [];
            const errorMessage = details.length > 0 ? details[0].message : '校验失败';
            (0, responseHelper_1.sendErrorResponse)(ctx, 400, errorMessage);
        }
    };
};
exports.default = validateMiddleware;
