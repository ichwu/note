import crypto from 'crypto';
import fs from 'fs';

// 计算文件的 MD5 值
export const calculateFileMD5 = (filepath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(filepath);

        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', err => {
            console.error('File read error:', err);
            reject(err);
        });
    });
};
