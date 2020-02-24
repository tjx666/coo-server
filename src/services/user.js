const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const configs = require('../../configs');

/**
 * 根据用户信息生成 JWT token
 * @param {Object} user 用户信息
 * @returns {String} JWT
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
 * @param {String} password 原密码
 * @returns {String} 密码加盐哈希值
 */
async function generateHashedPassword(password) {
    return bcrypt.hash(password, configs.security.passwordHashSaltRounds);
}

/**
 * 新建用户
 * @param {Object} userDto
 * @returns {Object} document
 */
async function createUser(userDto) {
    const hashedPassword = await generateHashedPassword(userDto.password);
    const newUser = new User({ ...userDto, password: hashedPassword });
    return newUser.save();
}

/**
 * 根据用户 id 获取用户
 * @param {String} id
 * @returns {Object} document
 */
async function findOneById(id) {
    return User.findOne({ _id: id });
}

/**
 * 根据过滤条件获取用户
 * @param {Object} projection
 * @returns {Object} document
 */
async function findAllUsers(projection = '-_id -__v -createdAt -updatedAt') {
    return User.find({}, projection);
}

/**
 * 登入验证
 * @param {String} email
 * @param {String} password
 * @returns {Boolean} 是否通过登入验证
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
 * @param {String} id
 * @param {Object} newUserInfo
 * @returns {Object} document
 */
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
