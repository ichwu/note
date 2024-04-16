import {Context, Next} from 'koa';
import Joi, {ObjectSchema, ValidationError} from 'joi';

// 定义错误消息集合
const errorMessages = {
    username: {
        'string.base': '用户名必须是字符串',
        'string.alphanum': '用户名只能包含字母和数字',
        'string.min': '用户名长度不能少于{#limit}个字符',
        'string.max': '用户名长度不能超过{#limit}个字符',
        'any.required': '用户名不能为空',
    },
    password: {
        'string.base': '密码必须是字符串',
        'string.pattern.base': '密码必须是字母和数字的组合，长度在3到30个字符之间',
        'any.required': '密码不能为空',
    },
    email: {
        'string.base': '邮箱必须是字符串',
        'string.email': '邮箱格式不正确',
        'any.required': '邮箱不能为空',
    }
};

// 定义校验规则
const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages(errorMessages.password),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: {allow: ['com', 'net']}
    }).required().messages(errorMessages.email)
});

const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages(errorMessages.password)
});

const userUpdateSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: {allow: ['com', 'net']}
    }).required().messages(errorMessages.email)
});

// 通用的校验中间件
const validateMiddleware = (schema: ObjectSchema) => {
    return async (ctx: Context, next: Next) => {
        try {
            // 校验请求体中的字段
            ctx.request.body = await schema.validateAsync(ctx.request.body); // 更新请求体为校验后的数据
            await next();
        } catch (error) {
            ctx.status = 400;
            // 使用类型断言告诉 TypeScript error 的确切类型
            const validationError = error as ValidationError;
            const details = validationError.details || [];
            const errorMessage = details.length > 0 ? details[0].message : '校验失败';
            ctx.body = {error: errorMessage};
        }
    };
};

export {validateMiddleware, registerSchema, loginSchema, userUpdateSchema};

