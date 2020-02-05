const bcrypt = require('bcrypt');

const { User } = require('../models');
const configs = require('../../configs');

const DEFAULT_HIDE_FIELDS = '-_id -__v';

const createUser = async userDto => {
    const hashedPassword = await bcrypt.hash(userDto.password, configs.security.passwordHashSaltRounds);
    const newUser = new User({ ...userDto, password: hashedPassword });

    await newUser.save();
};

const findOne = async (conditions, projection) => {
    return User.findOne(conditions, projection || DEFAULT_HIDE_FIELDS);
};

const findAllUsers = async projection => {
    return User.find({}, projection || DEFAULT_HIDE_FIELDS);
};

const checkLogin = async (email, password) => {
    const user = await findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
    }

    return false;
};

module.exports = {
    findOne,
    createUser,
    findAllUsers,
    checkLogin,
};
