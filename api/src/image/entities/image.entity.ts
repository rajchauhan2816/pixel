import { BaseImageDto } from './../dto/create-image.dto';
export class ImageKey {
    id: string;
}
export class Image extends BaseImageDto {
    id: string;
    name: string;
    uploadedBy: string;
    createAt: string;
    url: string;
    format: string;
    size: string;
    tags: string[];
}
