import Router from 'koa-router';
import articleController from '../controllers/articleController';
import validateMiddleware from "../middlewares/validationMiddleware";
import {articleAddSchema} from "../rules/article";

const router = new Router();

// 定义文章相关的路由
router.get('/articles', articleController.getAllArticles);
router.post('/article', validateMiddleware(articleAddSchema), articleController.createArticle);
router.get('/article/:id', articleController.getArticleById);
router.put('/article', articleController.updateArticle);
router.delete('/article/:ids', articleController.deleteArticle);

export default router;
