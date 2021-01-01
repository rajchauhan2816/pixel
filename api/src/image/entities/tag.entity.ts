export class TagKey {
    id: string;
}

export class TagImageKey {
    id: string;
}

export class Tag {
    id: string;
    createAt: string;
    usedAt: string;
}

export class TagImage {
    id: string;
    tag: string;
    image: string;
}
