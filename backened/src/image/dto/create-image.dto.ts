export class BaseImageDto {
    categoryType: string;

    tags: Array<string>;
}

export class CreateImageDto extends BaseImageDto {
    file: any[];
}
