import Router from 'koa-router';
import articleController from '../controllers/articleController';

const router = new Router();

// 定义文章相关的路由
router.get('/articles', articleController.getAllArticles);
router.get('/articles/:id', articleController.getArticleById);
router.post('/articles', articleController.createArticle);
router.put('/articles/:id', articleController.updateArticle);
router.delete('/articles/:id', articleController.deleteArticle);

export default router;
