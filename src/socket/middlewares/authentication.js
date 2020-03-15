const jwt = require('jsonwebtoken');

const configs = require('../../../configs');

module.exports = function authenticationMiddleware(socket, next) {
    // eslint-disable-next-line prefer-const
    let { token, id } = socket.handshake.query;
    if (!token) {
        return next(new Error('Authentication error: no token'));
    }

    if (!id) {
        return next(new Error('Authentication error: oo user id'));
    }

    token = token.replace('Bearer ', '');
    try {
        jwt.verify(token, configs.security.jwtSecret);
    } catch (error) {
        return next(new Error('Authentication error: token invalid'));
    }

    return next();
};
