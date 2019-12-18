const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        name: String,
        age: Number,
    },
    { timestamps: true }
);

module.exports = model('User', UserSchema);
