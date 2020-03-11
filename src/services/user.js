const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const { User } = require('../models');
const configs = require('../../configs');

const DEFAULT_PROJECTION = '-__v -createdAt -updatedAt -friends -password';

/**
 * 根据用户信息生成 JWT token
 *
 * @param {object} user 用户信息
 * @returns {string} JWT
 */
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

/**
 * 对密码进行加盐哈希
 *
 * @param {string} password 原密码
 * @returns {string} 密码加盐哈希值
 */
async function generateHashedPassword(password) {
    return bcrypt.hash(password, configs.security.passwordHashSaltRounds);
}

/**
 * 新建用户
 *
 * @param {object} userDto
 * @returns {object} document
 */
async function createUser(userDto) {
    const hashedPassword = await generateHashedPassword(userDto.password);
    const newUser = new User({ ...userDto, password: hashedPassword });
    return newUser.save();
}

/**
 * 根据用户 id 获取用户
 *
 * @param {string} id
 * @returns {object} document
 */
async function findOneById(id) {
    return User.findOne({ _id: id });
}

/**
 * 根据过滤条件获取用户
 *
 * @param {object} projection
 * @returns {object} document
 */
async function findAllUsers(projection = DEFAULT_PROJECTION) {
    return User.find({}, projection);
}

/**
 * 登入验证
 *
 * @param {string} email
 * @param {string} password
 * @returns {boolean} 是否通过登入验证
 */
async function checkLogin(email, password) {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
    }

    return false;
}

/**
 * 根据用户 id 更新用户
 *
 * @param {string} id
 * @param {object} newUserInfo
 * @returns {object} document
 */
async function updateOneById(id, newUserInfo) {
    if (newUserInfo.password) {
        newUserInfo.password = await generateHashedPassword(newUserInfo.password);
    } else {
        delete newUserInfo.password;
    }
    return User.updateOne({ _id: id }, newUserInfo);
}

async function findOneByEmail(email) {
    console.log({ email });
    const user = await User.findOne({ email }, DEFAULT_PROJECTION);
    return user || {};
}

async function findAllFriend(id) {
    const user = await findOneById(id);
    if (user === null) {
        throw Boom.badRequest('no this user!');
    }

    const friends = await User.find({}, DEFAULT_PROJECTION)
        .where('_id')
        .in(user.friends);
    return friends;
}

async function addNewFriend(from, target) {
    const user = await findOneById(from);
    if (user === null) {
        throw Boom.badRequest('user not exists!');
    }

    if (user.friends.includes(target)) {
        throw Boom.badRequest('You had already been friends!');
    }

    user.friends.push(target);
    await user.save();
}

module.exports = {
    generateJWT,
    findOneById,
    findOneByEmail,
    findAllFriend,
    createUser,
    findAllUsers,
    checkLogin,
    updateOneById,
    addNewFriend,
};
