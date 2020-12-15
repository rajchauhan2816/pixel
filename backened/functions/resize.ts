/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3 } from 'aws-sdk';
import sharp from 'sharp';

const ImageSize = {
    Large: {
        height: 800,
        width: 800,
    },
    MEDIUM: {
        height: 400,
        width: 400,
    },
    SMALL: {
        height: 200,
        width: 200,
    },
    THUMBNAIL: {
        height: 100,
        width: 100,
    },
};

const s3 = process.env.IS_s3_LOCAL
    ? new S3({
          accessKeyId: 'S3RVER', // This specific key is required when working offline
          secretAccessKey: 'S3RVER',
          endpoint: 'http://localhost:4569',
          s3ForcePathStyle: true,
          signatureVersion: 'v4',
      })
    : new S3();

export const handler: any = async (event: any, _context: any) => {
    const bucketName = event.Records[0].s3.bucket.name;
    const fileName = event.Records[0].s3.object.key;
    const file = await s3
        .getObject({
            Bucket: bucketName,
            Key: fileName,
        })
        .promise();

    const resizedS3Promises: any[] = [];

    for (const [key, value] of Object.entries(ImageSize)) {
        const buffer = file.Body as Buffer;
        const newBuffer = await sharp(buffer)
            .resize(value.width, value.height)
            .toBuffer();
        const splitName = fileName.split('.');
        const hashedName = `${splitName[0]}_${key}.${splitName[1]}`;
        resizedS3Promises.push(
            s3
                .putObject({
                    Bucket: bucketName + '-resized',
                    Key: hashedName,
                    Body: newBuffer,
                })
                .promise(),
        );
    }
    console.log(await Promise.all(resizedS3Promises));
};
