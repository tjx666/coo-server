const { Schema, model } = require('mongoose');
const omit = require('lodash/omit');

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        name: String,
        password: {
            type: String,
            required: true,
            maxlength: 60,
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
