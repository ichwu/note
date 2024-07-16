"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
// 分页处理函数
const paginate = async (model, ctx, queryParams = {}) => {
    const totalCount = await model.countDocuments(queryParams); // 查询总记录数
    const page = parseInt(ctx.query.page) || 1; // 获取页码，默认为第一页
    const limit = parseInt(ctx.query.limit) || totalCount; // 获取每页记录数，默认为全部
    // const totalPages = Math.ceil(totalCount / limit); // 计算总页数
    let query = model.find(queryParams);
    // 根据前端查询参数决定是否排序，并设置默认排序规则为升序（asc）
    const sort = ctx.query.sort === 'desc' ? -1 : 1;
    if (ctx.query.sortBy) {
        const sortBy = ctx.query.sortBy;
        const sortOptions = { [`${sortBy}`]: sort };
        query = query.sort(sortOptions);
    }
    const data = await query
        .skip((page - 1) * limit) // 跳过前面的记录
        .limit(limit); // 限制返回的记录数
    return {
        data,
        pagination: {
            pageNum: page,
            pageSize: limit,
            total: totalCount,
        }
    };
};
exports.paginate = paginate;
