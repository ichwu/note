"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHelper_1 = require("../helpers/responseHelper");
const Article_1 = require("../models/Article");
const User_1 = require("../models/User");
const paginate_1 = require("../utils/paginate");
const articleController = {
    /** 获取所有文章 **/
    getAllArticles: async (ctx) => {
        const queryParams = {};
        // 如果请求中包含参数，则设置模糊查询条件
        if (ctx.query.title) {
            queryParams['username'] = { $regex: new RegExp(ctx.query.tile, 'i') };
        }
        try {
            // 使用 paginate 进行分页查询
            const { data, pagination } = await (0, paginate_1.paginate)(Article_1.Article, ctx, queryParams);
            // 发送成功响应，返回分页数据和查询结果
            (0, responseHelper_1.sendSuccessResponse)(ctx, { pagination, rows: data });
        }
        catch (error) {
            // 捕获数据库操作中的错误，并发送错误响应
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    /** 添加文章 **/
    addArticle: async (ctx) => {
        const { articleId, articleParentId, title, content } = ctx.request.body;
        const user = await User_1.User.findOne({ username: ctx.state.user.username });
        if (!user) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, 'User not found');
            return;
        }
        try {
            const newArticle = new Article_1.Article({
                userId: user?.id,
                articleId,
                articleParentId,
                title,
                content,
                created: Date.now(),
                modify: Date.now() // 设置修改时间
            });
            await newArticle.save();
            (0, responseHelper_1.sendSuccessResponse)(ctx, newArticle);
        }
        catch (error) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    /** 获取文章详情 **/
    getArticleDetail: async (ctx) => {
        const articleId = ctx.params.id;
        try {
            const article = await Article_1.Article.findOne({ articleId });
            if (!article) {
                (0, responseHelper_1.sendErrorResponse)(ctx, 404, 'Article not found');
                return;
            }
            (0, responseHelper_1.sendSuccessResponse)(ctx, article);
        }
        catch (error) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    /** 更新文章 **/
    updateArticle: async (ctx) => {
        const updatedData = ctx.request.body;
        try {
            const articleId = updatedData.articleId;
            const article = await Article_1.Article.findOne({ articleId });
            if (!article) {
                (0, responseHelper_1.sendErrorResponse)(ctx, 404, 'Article not found');
                return;
            }
            // 更新文章数据
            updatedData.created = article.created;
            updatedData.modify = Date.now();
            Object.assign(article, updatedData);
            await article.save();
            (0, responseHelper_1.sendSuccessResponse)(ctx, article);
        }
        catch (error) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    },
    /** 删除文章 **/
    deleteArticle: async (ctx) => {
        const ids = ctx.params.ids;
        try {
            const result = await Article_1.Article.deleteMany({ articleId: { $in: ids.split(',').map((i) => i.trim()) } });
            (0, responseHelper_1.sendSuccessResponse)(ctx, result);
        }
        catch (error) {
            (0, responseHelper_1.sendErrorResponse)(ctx, 500, error.message);
        }
    }
};
exports.default = articleController;
