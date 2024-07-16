"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const articleController_1 = __importDefault(require("../controllers/articleController"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const article_1 = require("../rules/article");
const router = new koa_router_1.default();
/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 文章相关的 API
 */
/**
 * @swagger
 * /articles:
 *   get:
 *     summary: 获取所有文章
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: 文章标题进行模糊查询
 *     responses:
 *       200:
 *         description: 成功获取所有文章
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                       example: 1
 *                     totalPages:
 *                       type: number
 *                       example: 10
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       articleId:
 *                         type: string
 *                         example: "article123"
 *                       title:
 *                         type: string
 *                         example: "Sample Article Title"
 *                       content:
 *                         type: string
 *                         example: "This is a sample article content."
 *       500:
 *         description: 服务器错误
 */
router.get('/articles', articleController_1.default.getAllArticles);
/**
 * @swagger
 * /article:
 *   post:
 *     summary: 创建新文章
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 example: "article123"
 *               articleParentId:
 *                 type: string
 *                 example: "parent123"
 *               title:
 *                 type: string
 *                 example: "New Article Title"
 *               content:
 *                 type: string
 *                 example: "Content of the new article."
 *     responses:
 *       201:
 *         description: 文章创建成功
 *       400:
 *         description: 请求体验证失败
 *       500:
 *         description: 服务器错误
 */
router.post('/article', (0, validationMiddleware_1.default)(article_1.articleAddSchema), articleController_1.default.addArticle);
/**
 * @swagger
 * /article/{id}:
 *   get:
 *     summary: 获取文章详情
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 文章的唯一 ID
 *     responses:
 *       200:
 *         description: 成功获取文章详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articleId:
 *                   type: string
 *                   example: "article123"
 *                 title:
 *                   type: string
 *                   example: "Sample Article Title"
 *                 content:
 *                   type: string
 *                   example: "This is a sample article content."
 *       404:
 *         description: 文章未找到
 *       500:
 *         description: 服务器错误
 */
router.get('/article/:id', articleController_1.default.getArticleDetail);
/**
 * @swagger
 * /article:
 *   put:
 *     summary: 更新文章
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 example: "article123"
 *               articleParentId:
 *                 type: string
 *                 example: "parent123"
 *               title:
 *                 type: string
 *                 example: "Updated Article Title"
 *               content:
 *                 type: string
 *                 example: "Updated content of the article."
 *     responses:
 *       200:
 *         description: 文章更新成功
 *       400:
 *         description: 请求体验证失败
 *       404:
 *         description: 文章未找到
 *       500:
 *         description: 服务器错误
 */
router.put('/article', (0, validationMiddleware_1.default)(article_1.articleAddSchema), articleController_1.default.updateArticle);
/**
 * @swagger
 * /article/{ids}:
 *   delete:
 *     summary: 删除文章
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *         description: 需要删除的文章 ID 列表，以逗号分隔
 *     responses:
 *       200:
 *         description: 文章删除成功
 *       400:
 *         description: 请求格式错误
 *       500:
 *         description: 服务器错误
 */
router.delete('/article/:ids', articleController_1.default.deleteArticle);
exports.default = router;
