import mongoose, { Document, Model, Schema } from 'mongoose';

interface ITokenBlacklist extends Document {
    token: string;
    expiresAt: Date;
}

const TokenBlacklistSchema: Schema<ITokenBlacklist> = new Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
}, { versionKey: false }); // 禁用版本键;

// 通过调用 toJSON 方法，在序列化文档为 JSON 时转换 _id 为 id
TokenBlacklistSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id; // 将 _id 赋值给 id
        delete ret._id; // 删除 _id 字段
    }
});

// 创建 TTL 索引，过期时间为 1 秒
TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 1 });

export const TokenBlacklist: Model<ITokenBlacklist> = mongoose.model<ITokenBlacklist>('TokenBlacklist', TokenBlacklistSchema);
