import {Schema, model, Document} from 'mongoose';

export interface IUser extends Document {
    id: string;
    username: string;
    password: string;
    email: string;
    role: 'admin'| 'user';
}

const UserSchema = new Schema<IUser>({
    id: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, required: true}
}, { versionKey: false }); // 禁用版本键

export const User = model<IUser>('User', UserSchema);
