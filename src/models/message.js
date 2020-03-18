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
        // 暂不支持
        status: {
            type: String,
            // 分别表示已创建但未送达，消息已送达但是未读，消息已读
            enum: ['created', 'received', 'checked'],
            default: 'created',
        },
        fromType: {
            type: String,
            enum: ['user', 'group', 'system'],
            default: 'user',
        },
        toType: {
            type: String,
            enum: ['user', 'group', 'system'],
            default: 'user',
        },
        contentType: {
            type: String,
            enum: ['text', 'image', 'video'],
            default: 'text',
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toObject: {
            transform(_doc, ret) {
                ret.id = ret._id;
                return omit(ret, ['_id', 'createdAt', '__v']);
            },
        },
    },
);

module.exports = model('Message', MessageSchema);
