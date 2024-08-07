import { User, IUser } from '../models/User';

export const createUser = async (userData: Pick<IUser, 'id' | 'username' | 'email' | 'password' | 'role'>): Promise<IUser> => {
    const user = new User(userData);
    return user.save();
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    return User.findOne({ email }).exec();
};

export const findUserByUsername = async (username: string): Promise<IUser | null> => {
    return User.findOne({ username }).exec();
};
