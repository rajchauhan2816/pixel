import { ImageSchema } from './entities/image.schema';
import { DynamooseModule } from 'nestjs-dynamoose';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { S3Module } from 'nestjs-s3';

@Module({
    imports: [
        ConfigModule,
        DynamooseModule.forFeature([
            {
                name: 'image',
                schema: ImageSchema,
            },
        ]),
        S3Module.forRootAsync({
            useFactory: (_: ConfigService) => ({
                config: {
                    accessKeyId: 'S3RVER', // This specific key is required when working offline
                    secretAccessKey: 'S3RVER',
                    endpoint: 'http://localhost:4569',
                    s3ForcePathStyle: true,
                    signatureVersion: 'v4',
                },
            }),
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
    ],
    controllers: [ImageController],
    providers: [ImageService],
})
export class ImageModule {}
