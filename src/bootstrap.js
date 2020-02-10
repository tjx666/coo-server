/* eslint-disable import/order, new-cap */

const Koa = require('koa');
const Boom = require('@hapi/boom');

// helpers
const helpers = require('./helpers');

// middlewares
const responseTime = require('koa-response-time');
const requestLogger = require('koa-logger');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const middlewares = require('./middlewares');

const { env } = require('../utils/env');
const config = require('../configs');
const router = require('./controllers/v1');

const bootstrap = async () => {
    const app = new Koa();

    await helpers.logHelper(app);
    await helpers.dbHelper(app);
    await helpers.restifyHelper(app);
    await helpers.validateHelper(app);

    app.use(responseTime());
    if (env === 'development') app.use(requestLogger());
    app.use(helmet());
    app.use(cors());
    app.use(middlewares.staticMiddleware());
    app.use(bodyParser());
    app.use(middlewares.exceptionMiddleware());
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

    return app;
};

module.exports = bootstrap;
