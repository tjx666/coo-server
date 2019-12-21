/* eslint-disable new-cap */

const Koa = require('koa');
const responseTime = require('koa-response-time');
const requestLogger = require('koa-logger');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const chalk = require('chalk');
const Boom = require('@hapi/boom');

const loggerHelpers = require('./helpers/logger');
const dbHelper = require('./helpers/db');
const restifyHelper = require('./helpers/restify');
const validateHelper = require('./helpers/validate');

const exceptionMiddleware = require('./middlewares/exception');
const jwtExceptionMiddleware = require('./middlewares/jwtException');

const router = require('./controllers/v1');

const { env: mode } = require('../utils/env');
const config = require('../configs');

const bootstrap = async () => {
    const server = new Koa();

    await loggerHelpers(server);
    const { appLogger } = server;
    appLogger.info(`Startup server under ${chalk.bold.yellow(mode)} mode`);

    await dbHelper(server);
    await restifyHelper(server);
    await validateHelper(server);

    server.use(responseTime());
    if (mode === 'development') server.use(requestLogger());
    server.use(helmet());
    server.use(cors());
    server.use(bodyParser());
    server.use(exceptionMiddleware());
    server.use(jwtExceptionMiddleware());
    server.use(
        jwt({ secret: config.security.jwtSecret }).unless({
            path: [/\/api\/v\d\/users\/register/, /\/api\/v\d\/users\/login/],
        })
    );
    server.use(router.routes());
    server.use(
        router.allowedMethods({
            throw: true,
            notImplemented: () => new Boom.notImplemented(),
            methodNotAllowed: () => new Boom.methodNotAllowed(),
        })
    );

    return server;
};

module.exports = bootstrap;
