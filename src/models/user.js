const { Schema, model } = require('mongoose');
const omit = require('lodash/omit');

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
        // 文件名
        avatar: {
            type: String,
            maxlength: 40,
        },
    },
    {
        timestamps: true,
        toObject: {
            transform(doc, ret) {
                return omit(ret, ['createdAt', 'updatedAt', '__v', 'password']);
            },
        },
    },
);

module.exports = model('User', UserSchema);
