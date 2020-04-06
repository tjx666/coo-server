const Joi = require('@hapi/joi');

const { groupService } = require('../../services');

async function createGroup(ctx, next) {
    const schema = Joi.object({
        master: Joi.string().length(24).required(),
        name: Joi.string().max(24).required(),
    });
    await ctx.validateAsync(schema);

    const { master, name } = ctx.request.body;
    await groupService.createGroup(master, name);
    ctx.restify({}, 'create group success', 201);

    await next();
}

async function searchGroupById(ctx, next) {
    const schema = Joi.object({ master: Joi.string().length(24).required() });
    await ctx.validateAsync(schema);

    const group = await groupService.findGroupById(ctx.request.body.master);
    ctx.restify({
        existed: !!group,
        group: group ? group.toObject() : {},
    });

    await next();
}

async function applyForGroup(ctx, next) {
    const schema = Joi.object({
        userId: Joi.string().length(24).required(),
        groupId: Joi.string().length(24).required(),
    });
    await ctx.validateAsync(schema);

    const { userId, groupId } = ctx.request.body;
    await groupService.applyForGroup(userId, groupId);
    ctx.restify('join group success!');

    await next();
}

async function exitGroup(ctx, next) {
    const schema = Joi.object({
        userId: Joi.string().length(24).required(),
        groupId: Joi.string().length(24).required(),
    });
    await ctx.validateAsync(schema);

    const { userId, groupId } = ctx.request.body;
    await groupService.exitGroup(userId, groupId);
    ctx.restify('exit group success!');

    await next();
}

async function disbandGroup(ctx, next) {
    const schema = Joi.object({
        userId: Joi.string().length(24).required(),
        groupId: Joi.string().length(24).required(),
    });
    await ctx.validateAsync(schema);

    const { master, groupId } = ctx.request.body;
    await groupService.disbandGroup(master, groupId);
    ctx.restify('disband group success!');

    await next();
}

module.exports = {
    createGroup,
    searchGroupById,
    applyForGroup,
    disbandGroup,
    exitGroup,
};
