const { Schema, model, Types } = require('mongoose');
const omit = require('lodash/omit');

/**
 * status 字段说明：
 * 表示消息状态，后期可以用于实现客户端能够显示用户是否消息已读，目前不考虑实现
 * created: 表示消息已创建但是未送达
 * received: 表示消息已送达但是未读
 * checked：消息已读
 *
 * situation 字段说明：
 * 表示发送消息的情景
 * private（私聊）： from 和 to 都是用户 id
 * group（群聊）：from 就是用户 id，to 就是群 id
 * system（系统消息）：系统消息使用一个特殊的用户账号发送，目前使用邮箱为 systemMessage@admin.com 的用户账号
 *
 * content 字段说明：
 * contentType 是 text 即文本消息，content 就是消息内容
 * contentType 是 image 即图片消息，content 就是服务器上保存的图片 URL
 * contentType 是 video 即视频消息， content 就是服务器上保存的视频的 URL
 */
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
        status: {
            type: String,
            enum: ['created', 'received', 'checked'],
            default: 'created',
        },
        situation: {
            type: String,
            enum: ['private', 'group', 'system'],
            default: 'private',
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
                return omit(ret, ['_id', 'createdAt', 'updatedAt', '__v']);
            },
        },
    },
);

module.exports = model('Message', MessageSchema);
