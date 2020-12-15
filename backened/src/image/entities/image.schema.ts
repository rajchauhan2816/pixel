import { Schema } from 'dynamoose';

export const ImageSchema = new Schema({
    id: {
        type: String,
        hashKey: true,
    },
    categoryType: {
        type: String,
    },
    tags: {
        type: Array,
        schema: [String],
    },
    name: {
        type: String,
    },
    uploadedBy: {
        type: String,
    },
    url: {
        type: String,
    },
    format: {
        type: String,
    },
    createAt: {
        type: String,
    },
});
