import { Tag, TagKey, TagImage, TagImageKey } from './entities/tag.entity';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { ImageKey, Image } from './entities/image.entity';
import { InjectModel, Model } from 'nestjs-dynamoose';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImageService {
    /**
     *
     */
    bucketName: string;
    s3Url: string;
    region: string;
    constructor(
        @InjectModel('image')
        private readonly model: Model<Image, ImageKey>,
        @InjectModel('tag') private readonly tagModel: Model<Tag, TagKey>,
        @InjectModel('tagImage')
        private readonly tagImageModel: Model<TagImage, TagImageKey>,
        @InjectS3() private readonly s3: S3,
        config: ConfigService,
    ) {
        this.bucketName = config.get('S3_BUCKET') || 'pixel_images';
        this.s3Url = config.get('S3_BASE_URL') || 'http://localhost:4569';
        this.region = config.get('REGION') || 'ap-south-1';
    }
    async create(dto: CreateImageDto, username: string) {
        try {
            const { categoryType, tags } = dto;

            const uploadPromises: any[] = [];
            const dbPromises: any[] = [];
            const tagImagePromises: any[] = [];
            for (let i = 0; i < dto.file.length; i++) {
                const splitName = dto.file[i].originalname.split('.');
                const hashedName = `${splitName[0]}_${v4()}.${splitName[1]}`;
                /* ----------------------------- Uploading file ----------------------------- */

                uploadPromises.push(
                    this.s3
                        .putObject({
                            Bucket: this.bucketName,
                            Key: hashedName,
                            Body: dto.file[i].buffer,
                            ACL: 'public-read',
                        })
                        .promise(),
                );

                /* ------------------------- Inserting into database ------------------------ */

                const imageId = v4();

                dbPromises.push(
                    this.model.create({
                        id: imageId,
                        categoryType,
                        tags,
                        createAt: new Date().toISOString(),
                        format: splitName[1],
                        name: dto.file[i].originalname,
                        uploadedBy: username,
                        url: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${hashedName}`,
                        size: dto.file[i].size,
                    }),
                );

                /* ------------------------------ Tagging Image ----------------------------- */

                tags.forEach((val) =>
                    tagImagePromises.push(this.linkImageTag(val, imageId)),
                );
            }
            await Promise.all(uploadPromises);

            await Promise.all(tagImagePromises);

            return Promise.all(dbPromises);
        } catch (error) {
            console.log(error);
            throw new BadRequestException();
        }
    }

    async findAll() {
        const images = await this.model.scan().exec();
        return images;
    }

    async findAllByTag(tag: string) {
        const ids = await this.tagImageModel
            .query('tag')
            .eq(tag)
            .using('tagIndex')
            .exec();

        const imageKeys: ImageKey[] = ids.map((val) => ({
            id: val.image,
        }));

        if (imageKeys.length === 0) {
            return [];
        }

        const images = await this.model.batchGet(imageKeys);
        return images;
    }

    findOne(key: ImageKey) {
        return this.model.get(key);
    }

    async findTags() {
        // TODO: Add recent 25 tags logic
        const tags = await this.tagModel.scan().exec();
        return tags;
    }

    async findTypes() {
        return {
            types: ['ASSETS', 'Banner', 'Wallaper', 'Thumbnail', 'HD'],
        };
    }

    async linkImageTag(tag: string, image: string) {
        return this.tagImageModel.create({
            id: v4(),
            tag: (await this.createTag(tag)).id,
            image,
        });
    }

    async createTag(id: string) {
        const tag = await this.tagModel.get({ id });
        if (tag) return tag;
        return this.tagModel.create({
            id,
            createAt: new Date().toISOString(),
            usedAt: new Date().toISOString(),
        });
    }

    remove(key: ImageKey) {
        return this.model.delete(key);
    }
}
