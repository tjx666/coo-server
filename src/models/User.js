const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: String,
        password: {
            type: String,
            required: true,
            maxlength: 60,
        },
    },
    { timestamps: true }
);

module.exports = model('User', UserSchema);
