const { Message } = require('../models');

async function createMessage(from, to, content, options) {
    const newMessage = new Message({ from, to, content, ...options });
    return newMessage.save();
}

module.exports = {
    createMessage,
};
