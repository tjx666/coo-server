const Joi = require('@hapi/joi');

const { messageService } = require('../../services');

async function sendPrivateTextMessage(ctx, next) {
    const schema = Joi.object({
        from: Joi.string().required(),
        to: Joi.string().required(),
        content: Joi.string().required(),
    });
    await ctx.validateAsync(schema);

    const { from, to, content } = ctx.request.body;
    const newMessage = await messageService.createMessage(from, to, content);

    const socket = ctx.sockets.get(to);
    console.log(socket);
    if (socket) {
        socket.emit(
            'chat',
            {
                from,
                situation: 'private',
                content,
                contentType: 'text',
                createdAt: newMessage.createdAt,
            },
            (data) => {
                newMessage.status = 'received';
            },
        );
    }
    ctx.restify({
        createdAt: newMessage.createdAt,
    });

    await next();
}

module.exports = {
    sendPrivateTextMessage,
};
