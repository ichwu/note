import Joi from "joi";

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
const articleAddSchema = Joi.object({
    articleId: Joi.required().messages(errorMessages.articleId),
    articleParentId: Joi.required().messages(errorMessages.articleParentId),
    title: Joi.required().messages(errorMessages.title),
    content: Joi.required().messages(errorMessages.content),
});

export {
    articleAddSchema,
};


