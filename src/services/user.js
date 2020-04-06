const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const configs = require('../../configs');
const { User, Group } = require('../models');

/**
 * 根据用户信息生成 JWT token
 *
 * @param {object} user 用户信息
 * @returns {string} JWT
 */
function generateJWT(user) {
    const token = jwt.sign(
        {
            id: user._id,
            // 默认2周后 token 失效
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 * 2,
        },
        configs.security.jwtSecret,
    );
    return `Bearer ${token}`;
}

/**
 * 对密码进行加盐哈希
 *
 * @param {string} password 原密码
 * @returns {string} 长度为 60 的加盐哈希值
 */
async function generateHashedPassword(password) {
    return bcrypt.hash(password, configs.security.passwordHashSaltRounds);
}

/**
 * 新建用户
 *
 * @param {object} user
 * @returns {Document}
 */
async function createUser(user) {
    // eslint-disable-next-line no-use-before-define
    const existedUser = await findOneByEmail(user.email);
    if (existedUser !== null) {
        throw Boom.badRequest('the email had been used!', { code: 1 });
    }
    const hashedPassword = await generateHashedPassword(user.password);
    const newUser = new User({ ...user, password: hashedPassword });
    return newUser.save();
}

/**
 * 根据用户 id 获取用户
 *
 * @param {string} id
 * @returns {Document}
 */
async function findOneById(id) {
    return User.findOne({ _id: id });
}

/**
 * 获取所有用户
 *
 * @returns {Document}
 */
async function findAllUsers() {
    return User.find({});
}

/**
 * 登入验证
 *
 * @param {string} email
 * @param {string} password
 * @returns {Document}
 */
async function checkLogin(email, password) {
    const user = await User.findOne({ email });
    if (user === null) {
        throw new Boom.Boom('user not exist', { statusCode: 401, data: { code: 1 } });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
        throw new Boom.Boom('password not correct', { statusCode: 401, data: { code: 2 } });
    }

    return user;
}

/**
 * 根据用户 id 更新用户
 *
 * @param {string} id
 * @param {object} newUserInfo
 * @returns {Document}
 */
async function updateOneById(id, newUserInfo) {
    if (newUserInfo.password) {
        newUserInfo.password = await generateHashedPassword(newUserInfo.password);
    } else {
        delete newUserInfo.password;
    }
    return User.updateOne({ _id: id }, newUserInfo);
}

/**
 * 根据邮箱查找用户
 *
 * @param {string} email
 * @returns {Document}
 */
async function findOneByEmail(email) {
    const user = await User.findOne({ email });
    return user;
}

/**
 * 获取某用户所有好友
 *
 * @param {string} id 用户 id
 * @returns {Array<Document>}
 */
async function findAllFriend(id) {
    const user = await findOneById(id);
    if (user === null) {
        throw Boom.badRequest('no this user!');
    }

    const friends = await User.find({}).where('_id').in(user.friends);
    return friends;
}

/**
 * 添加好友
 *
 * @param {string} from 发出申请用户的 id
 * @param {string} target 好友 id
 * @returns {undefined}
 */
async function addNewFriend(from, target) {
    const [fromUser, targetUser] = await Promise.all([findOneById(from), findOneById(target)]);
    if (fromUser === null || targetUser === null) {
        throw Boom.badRequest('user does not exist!');
    }

    if (fromUser.friends.includes(target)) {
        throw Boom.badRequest('You had already been friends!');
    }

    fromUser.friends.push(target);
    targetUser.friends.push(from);
    await Promise.all([fromUser.save(), targetUser.save()]);
}

/**
 * 删除好友
 *
 * @param {string} from 发出申请用户的 id
 * @param {string} target 好友 id
 * @returns {undefined}
 */
async function deleteFriend(from, target) {
    const [fromUser, targetUser] = await Promise.all([findOneById(from), findOneById(target)]);
    if (fromUser === null || targetUser === null) {
        throw Boom.badRequest('user not exists!');
    }

    const friendIdIndex1 = fromUser.friends.indexOf(target);
    const friendIdIndex2 = targetUser.friends.indexOf(from);
    if (friendIdIndex1 === -1) {
        throw Boom.badRequest('You are not friends!');
    }

    fromUser.friends.splice(friendIdIndex1, 1);
    targetUser.friends.splice(friendIdIndex2, 1);
    await Promise.all([fromUser.save(), targetUser.save()]);
}

async function findAllJoinedGroups(id) {
    const user = await findOneById(id);
    if (user === null) {
        throw Boom.badRequest('no this user!', { code: 1 });
    }

    const groups = await Group.find({}).where('_id').in(user.groups);
    return groups;
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
    deleteFriend,
    findAllJoinedGroups,
};
