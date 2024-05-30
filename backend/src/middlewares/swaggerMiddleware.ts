import swaggerJSDoc from 'swagger-jsdoc';
import { koaSwagger } from 'koa2-swagger-ui';
import * as path from "node:path";

// 定义 Swagger 选项
const swaggerOptions = {
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

// console.log(require(path.resolve(__dirname, '../routes/userRoute.ts')))

// 初始化 swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerMiddleware = koaSwagger({
    routePrefix: '/docs', // Swagger UI 可访问的路径
    swaggerOptions: { spec: swaggerSpec as unknown as Record<string, unknown> },
});

export default swaggerMiddleware

export { swaggerSpec }

