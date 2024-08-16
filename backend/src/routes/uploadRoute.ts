import Router from 'koa-router';
import uploadController from '../controllers/uploadController';

const uploadRouter = new Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: 文件上传相关的 API
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: 上传文件
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 文件上传成功
 *       400:
 *         description: 请求中未包含文件
 */
uploadRouter.post('/upload', uploadController.uploadFile);

export default uploadRouter;
