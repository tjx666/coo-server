const bcrypt = require('bcrypt');

const { User } = require('../models');
const configs = require('../../configs');

const createUser = async userDto => {
    const hashedPassword = await bcrypt.hash(userDto.password, configs.security.passwordHashSaltRounds);
    const newUser = new User({ ...userDto, password: hashedPassword });

    return newUser.save();
};

const findOne = async conditions => {
    return User.findOne(conditions);
};

const findAllUsers = async projection => {
    return User.find({}, projection);
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
