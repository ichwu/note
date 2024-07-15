import { Context } from 'koa';
import { sendSuccessResponse, sendErrorResponse } from '../helpers/responseHelper';
import { IArticle, Article } from '../models/Article';
import {User} from "../models/User";

interface QueryParams {
    [key: string]: any;
}

const articleController = {
    getAllArticles: async (ctx: Context) => {
        const queryParams: QueryParams = {};
        // 示例：如果请求中包含文章标题参数，则设置模糊查询条件
        // if (ctx.query.title) {
        //     queryParams['title'] = { $regex: new RegExp(ctx.query.title, 'i') };
        // }

        try {
            const articles = await Article.find(queryParams);
            sendSuccessResponse(ctx, { articles });
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    getArticleById: async (ctx: Context) => {
        const articleId = ctx.params.id;
        try {
            const article = await Article.findById(articleId);
            if (!article) {
                sendErrorResponse(ctx, 404, 'Article not found');
                return;
            }
            sendSuccessResponse(ctx, { article });
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    createArticle: async (ctx: Context) => {
        const { articleId, articleParentId, title, content } = ctx.request.body as IArticle;
        const user = await User.findOne({username: ctx.state.user.username});
        if (!user) {
            sendErrorResponse(ctx, 500, 'User not found');
            return
        }
        try {
            const newArticle = new Article({
                userId: user?.id,
                articleId,
                articleParentId,
                title,
                content,
                created: Date.now(), // 设置创建时间
                modify: Date.now() // 设置修改时间
            });
            await newArticle.save();
            sendSuccessResponse(ctx, newArticle);
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    updateArticle: async (ctx: Context) => {
        const articleId = ctx.params.id;
        const updatedData = ctx.request.body;
        try {
            const article = await Article.findById(articleId);
            if (!article) {
                sendErrorResponse(ctx, 404, 'Article not found');
                return;
            }

            // 更新文章数据
            const createTime = article.created
            Object.assign(article, updatedData);
            article.created = createTime
            article.modify = Date.now(); // 更新修改时间
            await article.save();
            sendSuccessResponse(ctx, { article });
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    deleteArticle: async (ctx: Context) => {
        const articleId = ctx.params.id;
        try {
            const result = await Article.deleteOne({ _id: articleId });
            sendSuccessResponse(ctx, { result });
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    }
};

export default articleController;
