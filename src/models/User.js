const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    name: String,
    age: Number,
});

const UserModel = model('User', UserSchema);
module.exports = UserModel;
