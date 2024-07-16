"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
var koa2_swagger_ui_1 = require("koa2-swagger-ui");
var path = __importStar(require("node:path"));
// 定义 Swagger 选项
var swaggerOptions = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Koa API Documentation',
            version: '1.0.0',
            description: 'API documentation for the Koa application',
        },
    },
    apis: [path.resolve(__dirname, '../routes/*.ts'), path.resolve(__dirname, '../models/*.ts')],
};
// 初始化 swagger-jsdoc
var swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.swaggerSpec = swaggerSpec;
var swaggerMiddleware = (0, koa2_swagger_ui_1.koaSwagger)({
    routePrefix: '/docs',
    swaggerOptions: { spec: swaggerSpec },
});
exports.default = swaggerMiddleware;
