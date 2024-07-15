import { TokenBlocklist } from '../models/TokenBlocklist';

export async function addToBlocklist(token: string, expiresAt: Date): Promise<void> {
    await TokenBlocklist.create({ token, expiresAt });
}

// export async function clearExpiredTokens(): Promise<void> {
//     try {
//         const result = await TokenBlacklist.deleteMany({ expiresAt: { $lte: new Date() } });
//         console.log(`Cleared ${result.deletedCount} expired tokens from blacklist`);
//     } catch (error) {
//         console.error('Error while clearing expired tokens:', error);
//     }
// }
