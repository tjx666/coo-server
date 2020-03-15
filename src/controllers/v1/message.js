const Joi = require('@hapi/joi');

const { messageService } = require('../../services');

async function sendUserToUserTextMessage(ctx, next) {
    const schema = Joi.object({
        from: Joi.string().required(),
        to: Joi.string().required(),
        content: Joi.string().required(),
    });
    await ctx.validateAsync(schema);

    const { from, to, content } = ctx.request.body;
    const newMessage = await messageService.createMessage(from, to, content);

    const socket = ctx.sockets.get(to);
    if (socket) {
        socket.send(
            {
                from,
                fromType: 'user',
                contentType: 'text',
                content,
            },
            data => {
                newMessage.status = 'received';
            },
        );
    }
    ctx.restify();

    await next();
}

module.exports = {
    sendUserToUserTextMessage,
};
