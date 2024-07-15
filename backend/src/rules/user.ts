import Joi from "joi";

/** 定义错误消息集合 **/
const errorMessages = {
    id: {
        'any.required': 'id 不能为空',
    },
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
        'string.email': '邮箱格式不正确，最小域名片段为2，允许的后缀为com、net',
        'any.required': '邮箱不能为空',
    }
};

/** 定义校验规则 **/
const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages(errorMessages.password)
});

const userAddSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages(errorMessages.password),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: {allow: ['com', 'net']}
    }).required().messages(errorMessages.email)
});

const userUpdateSchema = Joi.object({
    id: Joi.required().messages(errorMessages.id),
    username: Joi.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: {allow: ['com', 'net']}
    }).required().messages(errorMessages.email)
});

export {
    loginSchema,
    userAddSchema,
    userUpdateSchema
};

