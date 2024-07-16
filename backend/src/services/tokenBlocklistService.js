"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToBlocklist = void 0;
const TokenBlocklist_1 = require("../models/TokenBlocklist");
async function addToBlocklist(token, expiresAt) {
    await TokenBlocklist_1.TokenBlocklist.create({ token, expiresAt });
}
exports.addToBlocklist = addToBlocklist;
// export async function clearExpiredTokens(): Promise<void> {
//     try {
//         const result = await TokenBlacklist.deleteMany({ expiresAt: { $lte: new Date() } });
//         console.log(`Cleared ${result.deletedCount} expired tokens from blacklist`);
//     } catch (error) {
//         console.error('Error while clearing expired tokens:', error);
//     }
// }
