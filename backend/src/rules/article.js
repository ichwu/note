"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleAddSchema = void 0;
const joi_1 = __importDefault(require("joi"));
/** 定义错误消息集合 **/
const errorMessages = {
    articleId: {
        'any.required': 'articleId 不能为空',
    },
    articleParentId: {
        'any.required': 'articleParentId 不能为空',
    },
    title: {
        'any.required': 'title 不能为空',
    },
    content: {
        'any.required': 'content 不能为空',
    },
};
/** 定义校验规则 **/
const articleAddSchema = joi_1.default.object({
    articleId: joi_1.default.required().messages(errorMessages.articleId),
    articleParentId: joi_1.default.required().messages(errorMessages.articleParentId),
    title: joi_1.default.required().messages(errorMessages.title),
    content: joi_1.default.required().messages(errorMessages.content),
});
exports.articleAddSchema = articleAddSchema;
