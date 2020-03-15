const { Message } = require('../models');

async function createMessage(from, to, content, options) {
    const defaultOptions = {
        fromType: 'user',
        toType: 'user',
        status: 'created',
        contentType: 'text',
    };
    const newMessage = new Message({ from, to, content, defaultOptions });
    return newMessage.save();
}

module.exports = {
    createMessage,
};
