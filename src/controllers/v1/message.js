const path = require('path');
const fs = require('fs-extra');
const multer = require('@koa/multer');
const compose = require('koa-compose');
const Joi = require('@hapi/joi');
const Boom = require('@hapi/boom');

const { messageService, groupService, userService } = require('../../services');
const config = require('../../../configs');
const { md5 } = require('../../../utils/crypt');
const { PROJECT_ROOT } = require('../../../utils/constants');

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
                newMessage.save();
            },
        );
    }
    ctx.restify({
        createdAt: newMessage.createdAt,
    });

    await next();
}

const multerForImageMessage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.server.maxMessageImageSize },
});
const sendPrivateImageMessage = compose([
    async (ctx, next) => {
        const schema = Joi.object({ from: Joi.string().required(), to: Joi.string().required() });
        await ctx.validateAsync(schema, 'query');
        await next();
    },
    multerForImageMessage.single('messageImage'),
    async (ctx, next) => {
        const imageFile = ctx.request.file;
        const digest = md5(imageFile.buffer);
        const fileName = `${digest}${path.extname(imageFile.originalname)}`;
        const filePath = path.resolve(PROJECT_ROOT, `./public/images/message/${fileName}`);

        const imageAddress = `/public/images/message/${fileName}`;
        const { from, to } = ctx.query;
        const newMessage = await messageService.createMessage(from, to, imageAddress, {
            contentType: 'image',
        });
        await fs.writeFile(filePath, imageFile.buffer);
        const socket = ctx.sockets.get(to);
        if (socket) {
            socket.emit(
                'chat',
                {
                    from,
                    situation: 'private',
                    content: imageAddress,
                    contentType: 'image',
                    createdAt: newMessage.createdAt,
                },
                (data) => {
                    newMessage.status = 'received';
                    newMessage.save();
                },
            );
        }
        ctx.restify({ imageAddress, createdAt: newMessage.createdAt });

        await next();
    },
]);

async function sendGroupTextMessage(ctx, next) {
    const schema = Joi.object({
        from: Joi.string().required(),
        to: Joi.string().required(),
        content: Joi.string().required(),
    });
    await ctx.validateAsync(schema);

    const { from, to, content } = ctx.request.body;
    const newMessage = await messageService.createMessage(from, to, content, {
        situation: 'group',
    });

    const group = await groupService.findGroupById(to);
    if (!group) {
        throw Boom.badRequest('group not existed!');
    }
    const fromUser = await userService.findOneById(from);
    group.members.forEach((userId) => {
        const userIdStr = userId.toString();
        if (userIdStr === from) return;
        const socket = ctx.sockets.get(userIdStr);

        if (socket) {
            socket.emit('chat', {
                from,
                fromUser: fromUser.toObject(),
                groupId: to,
                situation: 'group',
                content,
                contentType: 'text',
                createdAt: newMessage.createdAt,
            });
        }
    });
    ctx.restify({
        createdAt: newMessage.createdAt,
    });

    await next();
}

const sendGroupImageMessage = compose([
    async (ctx, next) => {
        const schema = Joi.object({ from: Joi.string().required(), to: Joi.string().required() });
        await ctx.validateAsync(schema, 'query');
        await next();
    },
    multerForImageMessage.single('messageImage'),
    async (ctx, next) => {
        const imageFile = ctx.request.file;
        const digest = md5(imageFile.buffer);
        const fileName = `${digest}${path.extname(imageFile.originalname)}`;
        const filePath = path.resolve(PROJECT_ROOT, `./public/images/message/${fileName}`);

        const imageAddress = `/public/images/message/${fileName}`;
        const { from, to } = ctx.query;
        const newMessage = await messageService.createMessage(from, to, imageAddress, {
            situation: 'group',
            contentType: 'image',
        });
        await fs.writeFile(filePath, imageFile.buffer);
        const group = await groupService.findGroupById(to);
        if (!group) {
            throw Boom.badRequest('group not existed!');
        }
        const fromUser = await userService.findOneById(from);
        group.members.forEach((userId) => {
            const userIdStr = userId.toString();
            if (userIdStr === from) return;
            const socket = ctx.sockets.get(userIdStr);
            if (socket) {
                socket.emit('chat', {
                    from,
                    fromUser: fromUser.toObject(),
                    groupId: to,
                    situation: 'group',
                    content: imageAddress,
                    contentType: 'image',
                    createdAt: newMessage.createdAt,
                });
            }
        });
        ctx.restify({ imageAddress, createdAt: newMessage.createdAt });

        await next();
    },
]);

module.exports = {
    sendPrivateTextMessage,
    sendPrivateImageMessage,
    sendGroupTextMessage,
    sendGroupImageMessage,
};
