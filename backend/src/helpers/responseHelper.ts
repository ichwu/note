import { Context } from 'koa';

// 封装成功响应函数
export const sendSuccessResponse = (ctx: Context, data: any = {}) => {
    ctx.status = 200;
    ctx.body = { code: 200, message: 'success', data: {...data} };
};

// 封装失败响应函数
export const sendErrorResponse = (ctx: Context, code: number, message: string) => {
    ctx.status = 200;
    ctx.body = { code, message };
};
