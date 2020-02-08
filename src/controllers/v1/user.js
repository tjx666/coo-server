const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

const { userService } = require('../../services');

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

module.exports = { register, login, getUsers, getUserById, updateUserById };
