import {Schema, model, Document} from 'mongoose';

export interface IArticle extends Document {
    userId: string;
    articleId: string;
    articleParentId: string;
    title: string;
    content: string;
    created: number;
    modify: number;
}

const ArticleSchema = new Schema<IArticle>({
    userId: {type: String, required: true},
    articleId: {type: String, required: true},
    articleParentId: {type: String, required: true},
    title: {type: String},
    content: {type: String},
    created: { type: Number, default: Date.now },
    modify: { type: Number, default: Date.now }
}, {versionKey: false}); // 禁用版本键

export const Article = model<IArticle>('Article', ArticleSchema);
