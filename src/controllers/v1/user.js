const path = require('path');
const fs = require('fs-extra');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const multer = require('@koa/multer');
const compose = require('koa-compose');

const config = require('../../../configs');
const { userService } = require('../../services');
const { PROJECT_ROOT } = require('../../../utils/constants');
const { md5 } = require('../../../utils/crypt');

async function register(ctx, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        name: Joi.string().max(24).required(),
        // !: 用户密码长度限制 18位
        password: Joi.string().max(18).required(),
    });
    await ctx.validateAsync(schema);

    const registerInfo = ctx.request.body;
    await userService.createUser(registerInfo);
    ctx.restify({}, 'register success!', 201);

    await next();
}

async function login(ctx, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().max(18).required(),
    });
    await ctx.validateAsync(schema);

    const { email, password } = ctx.request.body;
    const user = await userService.checkLogin(email, password);
    const token = userService.generateJWT(user);
    ctx.response.body = {
        code: 0,
        msg: 'login success!',
        data: {
            user: user.toObject(),
            token,
        },
    };

    await next();
}

async function getUsers(ctx, next) {
    const users = await userService.findAllUsers();
    ctx.restify(users.map((user) => user.toObject()));
    await next();
}

async function getUserById(ctx, next) {
    const schema = Joi.object({ id: Joi.string().length(24).required() });
    await ctx.validateAsync(schema, 'params');

    const user = await userService.findOneById(ctx.params.id);
    if (user === null) {
        throw Boom.badRequest('No user match the user id', { code: 1 });
    } else {
        ctx.restify(user.toObject());
    }

    await next();
}

async function searchUserByEmail(ctx, next) {
    const schema = Joi.object({ email: Joi.string().required() });
    await ctx.validateAsync(schema);

    const user = await userService.findOneByEmail(ctx.request.body.email);
    ctx.restify({
        existed: !!user,
        user: user ? user.toObject() : {},
    });

    await next();
}

async function updateUserById(ctx, next) {
    const paramsSchema = Joi.object({ id: Joi.string().length(24).required() });
    await ctx.validateAsync(paramsSchema, 'params');

    const bodySchema = Joi.object({ name: Joi.string(), password: Joi.string().allow('') });
    await ctx.validateAsync(bodySchema);

    await userService.updateOneById(ctx.params.id, ctx.request.body);
    ctx.restify();

    await next();
}

// 上传头像
const multerForAvatar = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.server.maxAvatarSize },
});
const uploadAvatar = compose([
    async (ctx, next) => {
        const schema = Joi.object({ id: Joi.string().length(24).required() });
        await ctx.validateAsync(schema, 'params');
        await next();
    },
    multerForAvatar.single('avatar'),
    async (ctx, next) => {
        const avatarFile = ctx.request.file;
        const digest = md5(avatarFile.buffer);
        const fileName = `${digest}${path.extname(avatarFile.originalname)}`;
        const filePath = path.resolve(PROJECT_ROOT, `./public/images/avatar/${fileName}`);

        await userService.updateOneById(ctx.params.id, { avatar: fileName });
        await fs.writeFile(filePath, avatarFile.buffer);
        ctx.restify({}, 'update avatar success!');

        await next();
    },
]);

async function getFriends(ctx, next) {
    const paramsSchema = Joi.object({ id: Joi.string().length(24).required() });
    await ctx.validateAsync(paramsSchema, 'params');

    const friends = await userService.findAllFriend(ctx.params.id);
    ctx.restify(friends.map((friend) => friend.toObject()));

    await next();
}

async function applyForNewFriend(ctx, next) {
    const schema = Joi.object({ id: Joi.string().length(24).required() });
    await ctx.validateAsync(schema);
    await ctx.validateAsync(schema, 'params');

    await userService.addNewFriend(ctx.params.id, ctx.request.body.id);
    await ctx.restify({}, 'apply for friend success!');

    await next();
}

async function removeFriend(ctx, next) {
    const schema = Joi.object({ id: Joi.string().length(24).required() });
    await ctx.validateAsync(schema);
    await ctx.validateAsync(schema, 'params');

    await userService.deleteFriend(ctx.params.id, ctx.request.body.id);
    await ctx.restify({}, 'remove friend success!');

    await next();
}

async function getGroups(ctx, next) {
    const paramsSchema = Joi.object({ id: Joi.string().length(24).required() });
    await ctx.validateAsync(paramsSchema, 'params');

    const groups = await userService.findAllJoinedGroups(ctx.params.id);
    ctx.restify(groups.map((group) => group.toObject()));

    await next();
}

module.exports = {
    register,
    login,
    getUsers,
    getUserById,
    searchUserByEmail,
    updateUserById,
    uploadAvatar,
    getFriends,
    applyForNewFriend,
    removeFriend,
    getGroups,
};
