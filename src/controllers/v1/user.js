const { userService } = require('../../services/');

const createUser = async (ctx, next) => {
    const userDto = ctx.request.body;
    await userService.createUser(userDto);
    ctx.restify();
    await next();
};

const getUsers = async (ctx, next) => {
    const users = await userService.findAllUsers();
    ctx.restify(users);
    await next();
};

module.exports = { createUser, getUsers };
