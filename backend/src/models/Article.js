"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const mongoose_1 = require("mongoose");
const ArticleSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    articleId: { type: String, required: true },
    articleParentId: { type: String, required: true },
    title: { type: String },
    content: { type: String },
    created: { type: Number, default: Date.now },
    modify: { type: Number, default: Date.now }
}, { versionKey: false }); // 禁用版本键
exports.Article = (0, mongoose_1.model)('Article', ArticleSchema);
