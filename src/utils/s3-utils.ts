import aws from 'aws-sdk';
import fs from 'fs';
const s3 = new aws.S3();

export class S3Utils {
    static downloadFileFromS3 = function (bucket: string, fileKey: string, filePath: string) {
        console.log('downloading', bucket, fileKey, filePath);
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(filePath),
                stream = s3
                    .getObject({
                        Bucket: bucket,
                        Key: fileKey
                    })
                    .createReadStream();
            stream.on('error', reject);
            file.on('error', reject);
            file.on('finish', () => {
                console.log('downloaded', bucket, fileKey);
                resolve(filePath);
            });
            stream.pipe(file);
        });
    };

    static uploadFileToS3 = function (
        bucket: string,
        fileKey: string,
        filePath: string,
        contentType: string
    ) {
        console.log('uploading', bucket, fileKey, filePath);
        return s3
            .upload({
                Bucket: bucket,
                Key: fileKey,
                Body: fs.createReadStream(filePath),
                ACL: 'private',
                ContentType: contentType
            })
            .promise();
    };

    static cleanDownloadedFile = async (filePath: string) => {
        await fs.unlink(filePath, (err) => {
            console.log('temporary file deleted ');
        });
    };
}
