const { Schema, model, Types } = require('mongoose');
const omit = require('lodash/omit');

const GroupSchema = new Schema(
    {
        master: {
            type: Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
            maxlength: 24,
        },
        // 图片 md5 值
        avatar: {
            type: String,
            maxlength: 40,
        },
        members: {
            type: [Types.ObjectId],
        },
    },
    {
        timestamps: true,
        toObject: {
            transform(_doc, ret) {
                if (ret.avatar) {
                    ret.avatar = `/public/images/avatar/${ret.avatar}`;
                }
                ret.id = ret._id;
                ret.count = ret.members.length;
                return omit(ret, ['_id', 'createdAt', 'updatedAt', '__v', 'members']);
            },
        },
    },
);

module.exports = model('Group', GroupSchema);
