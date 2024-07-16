"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = exports.userAddSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
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
const loginSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages(errorMessages.password)
});
exports.loginSchema = loginSchema;
const userAddSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages(errorMessages.password),
    email: joi_1.default.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] }
    }).required().messages(errorMessages.email)
});
exports.userAddSchema = userAddSchema;
const userUpdateSchema = joi_1.default.object({
    id: joi_1.default.required().messages(errorMessages.id),
    username: joi_1.default.string().alphanum().min(3).max(30).required().messages(errorMessages.username),
    email: joi_1.default.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] }
    }).required().messages(errorMessages.email)
});
exports.userUpdateSchema = userUpdateSchema;
