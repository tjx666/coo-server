const { Schema, model, Types } = require('mongoose');
const omit = require('lodash/omit');

const config = require('../../configs');

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            maxlength: 24,
        },
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
        friends: {
            type: [Types.ObjectId],
        },
    },
    {
        timestamps: true,
        toObject: {
            transform(_doc, ret) {
                const { address } = config.server;
                ret.avatar = `${address}/public/images/avatar/${ret.avatar}`;
                ret.id = ret._id;
                return omit(ret, ['_id', 'createdAt', 'updatedAt', '__v', 'password', 'friends']);
            },
        },
    },
);

module.exports = model('User', UserSchema);
