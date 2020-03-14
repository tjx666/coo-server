const { Schema, model, Types } = require('mongoose');
const omit = require('lodash/omit');

const MessageSchema = new Schema(
    {
        from: {
            type: Types.ObjectId,
            required: true,
        },
        to: {
            type: Types.ObjectId,
            required: true,
        },
        type: {
            type: String,
            enum: ['text'],
            default: 'text',
        },
        content: {
            type: String,
            required: true,
            default: '',
        },
    },
    {
        timestamps: {
            createdAt: true,
        },
        toObject: {
            transform(doc, ret) {
                ret.id = ret._id;
                return omit(ret, ['_id', 'createdAt', '__v']);
            },
        },
    },
);

module.exports = model(MessageSchema);
