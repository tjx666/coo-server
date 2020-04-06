const { Schema, model, Types } = require('mongoose');
const omit = require('lodash/omit');

const UserSchema = new Schema(
    {
        // 不需要 id 字段，mongodb 会未每个文档自动生成 _id 和 __v 字段

        // 邮箱
        email: {
            // 类型是字符串
            type: String,
            // 是集合内唯一的
            unique: true,
            // 不能为空
            required: true,
        },
        // 用户名
        name: {
            type: String,
            // 最大长度为 24
            maxlength: 24,
        },
        // 密码加盐哈希值
        password: {
            type: String,
            required: true,
            maxlength: 60,
        },
        // 图片 md5 值
        avatar: {
            type: String,
            maxlength: 40,
        },
        // 好友 ObjectId 数组
        friends: {
            type: [Types.ObjectId],
        },
        groups: {
            type: [Types.ObjectId],
        },
    },
    {
        // 自动添加 createdAt 和 updatedAt 字段
        timestamps: true,
        toObject: {
            transform(_doc, ret) {
                if (ret.avatar) {
                    ret.avatar = `/public/images/avatar/${ret.avatar}`;
                }
                // 响应内容增加 id 字段，忽略掉那些私密或者可能数据比较大的字段
                ret.id = ret._id;
                return omit(ret, [
                    '_id',
                    'createdAt',
                    'updatedAt',
                    '__v',
                    'password',
                    'friends',
                    'groups',
                ]);
            },
        },
    },
);

module.exports = model('User', UserSchema);
