import koaBody from 'koa-body';

// 创建 koa-body 中间件的配置
const koaBodyMiddleware = koaBody({
    multipart: true,
    formidable: {
        uploadDir: './uploads', // 临时存储上传文件的目录
        keepExtensions: true,   // 保持文件扩展名
        maxFieldsSize: 100 * 1024 * 1024, // 文件大小为 100 MB
    },
});

export default koaBodyMiddleware;
