import { User } from './../user/entities/user.entity';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
    Controller,
    Get,
    Post,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
    Body,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 5 }]))
    create(
        @Body() createImageDto: any,
        @UploadedFiles() upload: any,
        @CurrentUser() { username }: User,
    ) {
        createImageDto.file = upload.file;
        return this.imageService.create(createImageDto, username);
    }

    @Get()
    findAll() {
        return this.imageService.findAll();
    }

    @Get('tags')
    findTags() {
        return this.imageService.findTags();
    }

    @Get('tags/:tag')
    findImageByTag(@Param('tag') tag: string) {
        return this.imageService.findAllByTag(tag);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const image = await this.imageService.findOne({ id });
        console.log(image);
        return image;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.imageService.remove({ id });
    }
}
