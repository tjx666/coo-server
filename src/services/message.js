const { Message } = require('../models');

async function createMessage(from, to, content, options) {
    const defaultOptions = {
        fromType: 'user',
        toType: 'user',
        status: 'created',
        contentType: 'text',
    };
    options = { ...defaultOptions, ...options };
    const newMessage = new Message({ from, to, content, options });
    return newMessage.save();
}

module.exports = {
    createMessage,
};
