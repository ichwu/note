"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
// 封装成功响应函数
var sendSuccessResponse = function (ctx, data) {
    if (data === void 0) { data = {}; }
    // 将 Mongoose 文档转换为普通 JavaScript 对象
    if (data && data.toObject) {
        data = data.toObject();
    }
    ctx.status = 200;
    ctx.body = { code: 200, message: 'Success', data: data };
};
exports.sendSuccessResponse = sendSuccessResponse;
// 封装失败响应函数
var sendErrorResponse = function (ctx, code, message) {
    if (code === void 0) { code = 500; }
    if (message === void 0) { message = 'Internal Server Error'; }
    ctx.status = 200;
    ctx.body = { code: code, message: message };
};
exports.sendErrorResponse = sendErrorResponse;
