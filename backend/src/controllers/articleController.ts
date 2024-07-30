import {Context} from 'koa';
import {sendSuccessResponse, sendErrorResponse} from '../helpers/responseHelper';
import {IArticle, Article} from '../models/Article';
import {User} from "../models/User";
import {paginate} from "../utils/paginate";

interface QueryParams {
    [key: string]: any;
}

const articleController = {
    /** 获取所有文章 **/
    getAllArticles: async (ctx: any) => {
        const queryParams: QueryParams = {};
        // 如果请求中包含参数，则设置模糊查询条件
        if (ctx.query.title) {
            queryParams['username'] = {$regex: new RegExp(ctx.query.tile, 'i')};
        }
        try {
            // 使用 paginate 进行分页查询
            const {data, pagination} = await paginate<IArticle>(Article, ctx, queryParams);
            // 发送成功响应，返回分页数据和查询结果
            sendSuccessResponse(ctx, {pagination, rows: data});
        } catch (error: any) {
            // 捕获数据库操作中的错误，并发送错误响应
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    /** 添加文章 **/
    addArticle: async (ctx: any) => {
        const {id, parentId, title, content} = ctx.request.body as IArticle;
        const user = await User.findOne({username: ctx.state.user.username});
        if (!user) {
            sendErrorResponse(ctx, 500, 'User not found');
            return
        }
        try {
            const newArticle = new Article({
                userId: user?.id,
                id,
                parentId,
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

    /** 获取文章详情 **/
    getArticleDetail: async (ctx: any) => {
        const id = ctx.params.id;
        try {
            const article = await Article.findOne({ id });
            if (!article) {
                sendErrorResponse(ctx, 404, 'Article not found');
                return;
            }
            sendSuccessResponse(ctx, article);
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    /** 更新文章 **/
    updateArticle: async (ctx: Context) => {
        const updatedData = ctx.request.body as IArticle;
        try {
            const id = updatedData.id
            const article = await Article.findOne({ id });
            if (!article) {
                sendErrorResponse(ctx, 404, 'Article not found');
                return;
            }
            // 更新文章数据
            updatedData.created = article.created
            updatedData.modify = Date.now();
            Object.assign(article, updatedData);
            await article.save();
            sendSuccessResponse(ctx, article);
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    },

    /** 删除文章 **/
    deleteArticle: async (ctx: Context) => {
        const ids = ctx.params.ids;
        try {
            const result = await Article.deleteMany({id: {$in: ids.split(',').map((i: string) => i.trim())}});
            sendSuccessResponse(ctx, result);
        } catch (error: any) {
            sendErrorResponse(ctx, 500, error.message);
        }
    }
};

export default articleController;
