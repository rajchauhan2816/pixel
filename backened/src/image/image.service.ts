import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { ImageKey, Image } from './entities/image.entity';
import { InjectModel, Model } from 'nestjs-dynamoose';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectS3, S3 } from 'nestjs-s3';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
    /**
     *
     */
    bucketName: string;
    s3Url: string;
    constructor(
        @InjectModel('image')
        private readonly model: Model<Image, ImageKey>,
        @InjectS3() private readonly s3: S3,
        config: ConfigService,
    ) {
        this.bucketName = config.get('S3_BUCKET') || 'pixel_images';
        this.s3Url = config.get('S3_BASE_URL') || 'http://localhost:4569';
        this.s3
            .createBucket({
                Bucket: this.bucketName,
            })
            .promise()
            .then((val) => console.log(val))
            .catch((_) => ({}));
    }
    async create(dto: CreateImageDto, username: string) {
        const { categoryType, tags } = dto;
        const uploadPromises = [];
        const dbPromises = [];
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
                    })
                    .promise(),
            );

            /* ------------------------- Inserting into database ------------------------ */

            dbPromises.push(
                this.model.create({
                    id: v4(),
                    categoryType,
                    tags,
                    createAt: new Date().toISOString(),
                    format: splitName[1],
                    name: hashedName,
                    uploadedBy: username,
                    url: `${this.s3Url}/${this.bucketName}/${hashedName}`,
                    size: dto.file[i].size,
                }),
            );
        }
        await Promise.all(uploadPromises);

        return Promise.all(dbPromises);
    }

    async findAll() {
        const images = await this.model.scan().exec();
        return images;
    }

    findOne(id: number) {
        return `This action returns a #${id} image`;
    }

    update(id: number, _updateImageDto: UpdateImageDto) {
        return `This action updates a #${id} image`;
    }

    remove(id: number) {
        return `This action removes a #${id} image`;
    }
}
