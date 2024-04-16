import {Schema, model, Document} from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
}

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
}, { versionKey: false }); // 禁用版本键

// 通过调用 toJSON 方法，在序列化文档为 JSON 时转换 _id 为 id
UserSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id; // 将 _id 赋值给 id
        delete ret._id; // 删除 _id 字段
    }
});

export const User = model<IUser>('User', UserSchema);
