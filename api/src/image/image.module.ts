import { TagSchema, TagImageSchema } from './entities/tag.schema';
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
            {
                name: 'tag',
                schema: TagSchema,
            },
            {
                name: 'tagImage',
                schema: TagImageSchema,
            },
        ]),
        S3Module.forRootAsync({
            useFactory: (_: ConfigService) => ({
                config: {
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
