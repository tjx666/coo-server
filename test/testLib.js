const Boom = require('@hapi/boom');

try {
    throw Boom.badGateway('未认证');
} catch (err) {
    console.error(err.message);
}
