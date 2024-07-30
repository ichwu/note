import { Blocklist } from '../models/Blocklist';

export async function addToBlocklist(token: string, expiresAt: Date): Promise<void> {
    await Blocklist.create({ token, expiresAt });
}

export async function clearExpiredTokens(): Promise<void> {
    try {
        const result = await Blocklist.deleteMany({ expiresAt: { $lte: new Date() } });
        console.log(`Cleared ${result.deletedCount} expired tokens from blacklist`);
    } catch (error) {
        console.error('Error while clearing expired tokens:', error);
    }
}
