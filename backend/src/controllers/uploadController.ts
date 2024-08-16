import { Context } from 'koa';
import { sendSuccessResponse, sendErrorResponse } from '../helpers/responseHelper';
import OSS from 'ali-oss';
import path from "path";
import {calculateFileMD5} from "../helpers/fileHelper";
import fs from "fs";
// import { nanoid } from 'nanoid';

const ossClient = new OSS({
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID as string,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET as string,
    bucket: process.env.OSS_BUCKET_NAME,
});

const uploadController = {
    /** 上传文件 **/
    uploadFile: async (ctx: Context) => {
        const file = ctx.request?.files?.file;

        if (!file) {
            sendErrorResponse(ctx, 400, 'No file uploaded');
            return;
        }

        try {
            // 确保 `file` 是一个数组
            const fileArray = Array.isArray(file) ? file : [file];

            const uploadPromises = fileArray.map(async (file) => {
                try {
                    // 计算文件的 MD5 值
                    const md5 = await calculateFileMD5(file.filepath);
                    const ext = path.extname(file.originalFilename as string);
                    const newFilename = `${md5}${ext}`;

                    // 上传文件到阿里云 OSS
                    const result = await ossClient.put(newFilename, file.filepath);

                    // 删除临时文件
                    fs.unlinkSync(file.filepath);

                    // 返回上传文件的 URL
                    return {
                        originalFilename: file.originalFilename,
                        filename: newFilename,
                        url: result.url
                    };
                } catch (error: any) {
                    return {
                        originalFilename: file.originalFilename,
                        error: error.message
                    };
                }
            });

            // 等待所有上传操作完成
            const results = await Promise.all(uploadPromises);

            // console.log('fileArray: ', fileArray)
            // console.log('result: ', results)

            // 检查是否有错误发生
            const hasErrors = results.some(result => result.error);

            if (hasErrors) {
                // 如果有错误，发送错误响应
                sendErrorResponse(ctx, 500, 'Some files failed to upload');
                return;
            }

            // 发送成功响应，返回文件的URL
            sendSuccessResponse(ctx, { message: 'File uploaded successfully', results });
        } catch (error: any) {
            // 捕获上传错误并发送错误响应
            console.log('error: ', error)
            sendErrorResponse(ctx, 500, error.message);
        }
    },
};

export default uploadController;
