import mongoose, { Document, Model, Schema } from 'mongoose';

interface ITokenBlacklist extends Document {
    token: string;
    expiresAt: Date;
}

const TokenBlacklistSchema: Schema<ITokenBlacklist> = new Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true }
}, { versionKey: false }); // 禁用版本键;

// 创建 TTL 索引，过期时间为 1 秒
TokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 1 });

export const TokenBlacklist: Model<ITokenBlacklist> = mongoose.model<ITokenBlacklist>('TokenBlacklist', TokenBlacklistSchema);
