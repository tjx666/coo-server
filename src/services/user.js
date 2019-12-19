const { User } = require('../models');

const createUser = async userDto => {
    const newUser = new User(userDto);
    await newUser.save();
};

const findAllUsers = async (allFields = false) => {
    const users = await User.find().select(allFields ? undefined : '-_id -__v');
    return users;
};

module.exports = {
    createUser,
    findAllUsers,
};
