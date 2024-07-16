"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByUsername = exports.findUserByEmail = exports.createUser = void 0;
const User_1 = require("../models/User");
const createUser = async (userData) => {
    const user = new User_1.User(userData);
    return user.save();
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    return User_1.User.findOne({ email }).exec();
};
exports.findUserByEmail = findUserByEmail;
const findUserByUsername = async (username) => {
    return User_1.User.findOne({ username }).exec();
};
exports.findUserByUsername = findUserByUsername;
