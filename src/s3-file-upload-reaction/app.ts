import { S3CreateEvent, Context } from 'aws-lambda';
import path from 'path';
import os from 'os';
import { S3Utils } from '../utils/s3-utils';
const supportedFormats = ['csv', 'xlsx'];

function extractS3Info(event: S3CreateEvent) {
    const eventRecord = event.Records && event.Records[0];
    const bucket = eventRecord.s3.bucket.name;
    const { key } = eventRecord.s3.object;
    return { bucket, key };
}
exports.handler = async (event: S3CreateEvent, context: Context) => {
    try {
        const s3Info = extractS3Info(event);
        const id = context.awsRequestId;
        const extension = path.extname(s3Info.key).toLowerCase();
        const tempFile = path.join(os.tmpdir(), id + extension);
        const extensionWithoutDot = extension.slice(1);

        console.log('converting', s3Info.bucket, ':', s3Info.key, 'using', tempFile);
        if (!supportedFormats.includes(extensionWithoutDot)) {
            throw new Error(`unsupported file type ${extension}`);
        }
        await S3Utils.downloadFileFromS3(s3Info.bucket, s3Info.key, tempFile);
        // do whatever you want to do with the file
        // contentType = `image/${extensionWithoutDot}`;
        // await S3Utils.uploadFileToS3(OUTPUT_BUCKET, s3Info.key, tempFile, contentType);
        await S3Utils.cleanDownloadedFile(tempFile);
    } catch (err) {
        console.log(JSON.stringify(err));
    }
};
