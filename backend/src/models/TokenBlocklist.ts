import mongoose, { Document, Model, Schema } from 'mongoose';

interface ITokenBlocklist extends Document {
    token: string;
    expiresAt: Date;
}

const TokenBlocklistSchema: Schema<ITokenBlocklist> = new Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
}, { versionKey: false }); // 禁用版本键;

// 创建 TTL 索引，过期时间为 1 秒
TokenBlocklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 1 });

export const TokenBlocklist: Model<ITokenBlocklist> = mongoose.model<ITokenBlocklist>('TokenBlocklist', TokenBlocklistSchema);
