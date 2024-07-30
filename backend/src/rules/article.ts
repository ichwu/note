import Joi from "joi";

/** 定义错误消息集合 **/
const errorMessages = {
    id: {
        'any.required': 'id 不能为空',
    },
    parentId: {
        'any.required': 'parentId 不能为空',
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
    id: Joi.required().messages(errorMessages.id),
    parentId: Joi.required().messages(errorMessages.parentId),
    title: Joi.required().messages(errorMessages.title),
    content: Joi.required().messages(errorMessages.content),
});

export {
    articleAddSchema,
};


