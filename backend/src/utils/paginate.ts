import { Document, Model, FilterQuery } from 'mongoose';
import { ParameterizedContext } from 'koa'

interface QueryParams {
    [key: string]: any;
}

// 分页处理函数
export const paginate = async <T extends Document>(
    model: Model<T>,
    ctx: ParameterizedContext,
    queryParams: QueryParams = {}
): Promise<{ data: T[]; pagination: { page: number; limit: number; totalCount: number; totalPages: number } }> => {

    const totalCount = await model.countDocuments(queryParams as FilterQuery<T>); // 查询总记录数
    const page = parseInt(ctx.query.page as string) || 1; // 获取页码，默认为第一页
    const limit = parseInt(ctx.query.limit as string) || totalCount; // 获取每页记录数，默认为全部
    const totalPages = Math.ceil(totalCount / limit); // 计算总页数

    let query = model.find(queryParams as FilterQuery<T>);

    // 根据前端查询参数决定是否排序，并设置默认排序规则为升序（asc）
    const sort = ctx.query.sort === 'desc' ? -1 : 1;
    if (ctx.query.sortBy) {
        const sortBy = ctx.query.sortBy;
        const sortOptions = { [`${sortBy}`]: sort } as any;
        query = query.sort(sortOptions);
    }

    const data = await query
        .skip((page - 1) * limit) // 跳过前面的记录
        .limit(limit); // 限制返回的记录数
    return {
        data,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages
        }
    };
};
