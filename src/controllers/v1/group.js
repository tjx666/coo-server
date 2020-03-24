const Joi = require('@hapi/joi');
const { groupService } = require('../../services');

async function createGroup(ctx, next) {
    const schema = Joi.object({ master: Joi.string().required(), name: Joi.string().required() });
    await ctx.validateAsync(schema);

    const { master, name } = ctx.request.body;
    await groupService.createGroup(master, name);
    ctx.restify();
    await next();
}

module.exports = {
    createGroup,
};
