const { Schema, model, Types } = require('mongoose');
const omit = require('lodash/omit');

const MessageSchema = new Schema(
    {
        // 系统消息使用一个特殊的用户账号发送，目前使用邮箱为 systemMessage@admin.com 的用户账号

        // 消息发送者
        from: {
            type: Types.ObjectId,
            required: true,
        },
        // 消息接受者
        to: {
            type: Types.ObjectId,
            required: true,
        },
        // 消息状态，后期可以用于实现客户端能够显示用户是否消息已读，目前不考虑实现
        status: {
            type: String,
            // created: 表示消息已创建但是未送达, received: 表示消息已送达但是未读, checked：消息已读
            enum: ['created', 'received', 'checked'],
            default: 'created',
        },
        // 发送消息的情景
        situation: {
            type: String,
            // 分别为私聊，群聊，系统消息
            enum: ['private', 'group', 'system'],
            default: 'private',
        },
        // 消息格式
        contentType: {
            type: String,
            // 分别表示文本，图片，视频消息
            enum: ['text', 'image', 'video'],
            default: 'text',
        },
        // 消息内容，如果是文本消息就是文本内容，图片和视频消息就是对应资源在服务器的 URL
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
                return omit(ret, ['_id', '__v', 'createdAt', 'updatedAt']);
            },
        },
    },
);

module.exports = model('Message', MessageSchema);
