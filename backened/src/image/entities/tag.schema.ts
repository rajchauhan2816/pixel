import { Schema } from 'dynamoose';

export const TagSchema = new Schema({
    id: {
        type: String,
        hashKey: true,
    },
    createAt: {
        type: String,
    },
    usedAt: {
        type: String,
    },
});

export const TagImageSchema = new Schema({
    id: {
        type: String,
        hashKey: true,
    },
    tag: {
        type: String,
        index: {
            name: 'tagIndex',
            global: true,
        },
    },
    image: {
        type: String,
    },
});
