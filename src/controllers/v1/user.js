const path = require('path');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const multer = require('@koa/multer');
const compose = require('koa-compose');
const fs = require('fs-extra');

const { userService } = require('../../services');
const { md5 } = require('../../../utils/crypt');
const config = require('../../../configs');
const { PROJECT_ROOT } = require('../../../utils/constants');

async function register(ctx, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        name: Joi.string().required(),
        password: Joi.string()
            .max(60)
            .required(),
    });
    await ctx.validateAsync(schema);

    const userDto = ctx.request.body;
    const user = await userService.createUser(userDto);

    ctx.status = 201;
    ctx.response.body = {
        code: 0,
        msg: 'register success!',
        data: {
            user: user.toObject(),
            token: userService.generateJWT(user),
        },
    };

    await next();
}

async function login(ctx, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string()
            .max(60)
            .required(),
    });
    await ctx.validateAsync(schema);

    const { email, password } = ctx.request.body;
    const user = await userService.checkLogin(email, password);

    if (user) {
        ctx.response.body = {
            code: 0,
            msg: 'login success!',
            data: {
                user: user.toObject(),
                token: userService.generateJWT(user),
            },
        };
    } else {
        throw Boom.unauthorized();
    }

    await next();
}

async function getUsers(ctx, next) {
    const users = await userService.findAllUsers();
    ctx.restify(users);
    await next();
}

async function getUserById(ctx, next) {
    const schema = Joi.object({ id: Joi.string().required() });
    await ctx.validateAsync(schema, 'params');

    const user = await userService.findOneById(ctx.params.id);
    if (user === null) {
        throw Boom.notFound();
    } else {
        ctx.restify(user.toObject());
    }

    await next();
}

async function updateUserById(ctx, next) {
    const paramsSchema = Joi.object({ id: Joi.string().required() });
    await ctx.validateAsync(paramsSchema, 'params');

    const bodySchema = Joi.object({ name: Joi.string(), password: Joi.string().allow('') });
    await ctx.validateAsync(bodySchema);

    await userService.updateOneById(ctx.params.id, ctx.request.body || {});
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
        const schema = Joi.object({ id: Joi.string().required() });
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

module.exports = { register, login, getUsers, getUserById, updateUserById, uploadAvatar };
