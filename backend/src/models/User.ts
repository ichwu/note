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

export const User = model<IUser>('User', UserSchema);
