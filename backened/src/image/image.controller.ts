import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 5 }]))
    create(@UploadedFiles() createImageDto: CreateImageDto) {
        return this.imageService.create(createImageDto, 'z1nn');
    }

    @Get()
    findAll() {
        return this.imageService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.imageService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
        return this.imageService.update(+id, updateImageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.imageService.remove(+id);
    }
}
