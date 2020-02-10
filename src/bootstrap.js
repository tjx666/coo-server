/* eslint-disable import/order, new-cap */

const Koa = require('koa');
const Boom = require('@hapi/boom');

// helpers
const loggerHelpers = require('./helpers/logger');
const dbHelper = require('./helpers/db');
const restifyHelper = require('./helpers/restify');
const validateHelper = require('./helpers/validate');

// middlewares
const responseTime = require('koa-response-time');
const requestLogger = require('koa-logger');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const staticServe = require('koa-static');
const koaBody = require('koa-bodyparser');
const jwt = require('koa-jwt');

const exceptionMiddleware = require('./middlewares/exception');
const jwtExceptionMiddleware = require('./middlewares/jwtException');

const { env, projectRoot, resolvePath } = require('../utils/env');
const config = require('../configs');
const router = require('./controllers/v1');

const bootstrap = async () => {
    const app = new Koa();

    await loggerHelpers(app);
    await dbHelper(app);
    await restifyHelper(app);
    await validateHelper(app);

    app.use(responseTime());
    env === 'development' && app.use(requestLogger());
    app.use(helmet());
    app.use(cors());
    // 强缓存2周
    app.use(staticServe(resolvePath(projectRoot, './public'), { maxage: 1000 * 60 * 60 * 7 * 2 }));
    app.use(koaBody());
    app.use(exceptionMiddleware());
    app.use(jwtExceptionMiddleware());
    app.use(
        jwt({ secret: config.security.jwtSecret }).unless({
            path: [/\/api\/v\d\/users\/register/, /\/api\/v\d\/users\/login/],
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
