const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const configs = require('../../configs');

function generateJWT(user) {
    const token = jwt.sign(
        {
            data: user,
            // 默认2周后 token 失效
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 7 * 2,
        },
        configs.security.jwtSecret,
    );

    return `Bearer ${token}`;
}

async function generateHashedPassword(password) {
    return bcrypt.hash(password, configs.security.passwordHashSaltRounds);
}

async function createUser(userDto) {
    const hashedPassword = await generateHashedPassword(userDto.password);
    const newUser = new User({ ...userDto, password: hashedPassword });

    return newUser.save();
}

async function findOneById(id) {
    return User.findOne({ _id: id });
}

async function findAllUsers(projection) {
    return User.find({}, projection);
}

async function checkLogin(email, password) {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
    }

    return false;
}

async function updateOneById(id, newUserInfo) {
    if (newUserInfo.password) {
        newUserInfo.password = await generateHashedPassword(newUserInfo.password);
    } else {
        delete newUserInfo.password;
    }
    return User.update({ _id: id }, newUserInfo);
}

module.exports = {
    generateJWT,
    findOneById,
    createUser,
    findAllUsers,
    checkLogin,
    updateOneById,
};
