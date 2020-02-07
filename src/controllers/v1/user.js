const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const { userService } = require('../../services');
const configs = require('../../../configs');

function generateJWT(user) {
    const token = jwt.sign(
        {
            data: user,
            exp: Math.floor(Date.now() / 1000) + 6 * 60 * 60,
        },
        configs.security.jwtSecret,
    );

    return `Bearer ${token}`;
}

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
            token: generateJWT(user),
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
                token: generateJWT(user),
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

async function getUser(ctx, next) {
    const schema = Joi.object({ id: Joi.string().required() });
    await ctx.validateAsync(schema, 'params');
    const user = await userService.findOne({ _id: ctx.params.id });
    ctx.restify(user.toObject());
    await next();
}

module.exports = { register, login, getUsers, getUser };
