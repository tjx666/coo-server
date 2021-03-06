/* eslint-disable new-cap */
const Boom = require('@hapi/boom');
const responseTime = require('koa-response-time');
const requestLogger = require('koa-logger');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');

const exceptionMiddleware = require('./exception');
const staticMiddleware = require('./static');
const router = require('../controllers/v1');

const config = require('../../configs');
const { ENV } = require('../../utils/constants');

module.exports = async function setupMiddlewares(app) {
    app.use(responseTime());
    if (ENV === 'development') app.use(requestLogger());
    app.use(helmet());
    // 跨域过期时间设置为 2 周
    app.use(cors({ maxAge: 60 * 60 * 24 * 14 }));
    app.use(staticMiddleware());
    app.use(bodyParser());
    app.use(exceptionMiddleware());
    app.use(
        jwt({ secret: config.security.jwtSecret }).unless({
            // 排除静态服务，登入，注册路由
            path: [/^\/public\//, /^\/api\/v\d\/users\/(register|login)/],
        }),
    );
    app.use(router.routes());
    app.use(
        router.allowedMethods({
            throw: true,
            notImplemented: () => new Boom.notImplemented(),
            methodNotAllowed: () => new Boom.methodNotAllowed(),
        }),
    );
};
