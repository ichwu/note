import { Context } from 'koa';

// 封装成功响应函数
export const sendSuccessResponse = (ctx: Context, data: any = {}) => {
    // 将 Mongoose 文档转换为普通 JavaScript 对象
    if (data && data.toObject) {
        data = data.toObject();
    }
    ctx.status = 200;
    ctx.body = { code: 200, message: 'Success', data };
};

// 封装失败响应函数
export const sendErrorResponse = (ctx: Context, code: number = 500, message: string = 'Internal Server Error') => {
    ctx.status = 200;
    ctx.body = { code, message };
};
