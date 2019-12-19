//     ____   U  ___ u   U  ___ u
//  U /"___|   \/"_ \/    \/"_ \/
//  \| | u     | | | |    | | | |
//   | |/__.-,_| |_| |.-,_| |_| |
//    \____|\_)-\___/  \_)-\___/
//   _// \\      \\         \\
//  (__)(__)    (__)       (__)

/* eslint-disable new-cap */

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const requestLogger = require('koa-logger');
const chalk = require('chalk');
const Boom = require('@hapi/boom');

const loggerHelpers = require('./helpers/logger');
const dbHelper = require('./helpers/db');
const restifyHelper = require('./helpers/restify');
const validateHelper = require('./helpers/validate');

const exceptionMiddleware = require('./middlewares/exception');
const router = require('./controllers/v1');

const bootstrap = async () => {
    const server = new Koa();
    const env = process.env.NODE_ENV;

    await loggerHelpers(server);
    const { appLogger } = server;
    const mode = process.env.NODE_ENV || 'production';
    appLogger.info(`Startup server under ${chalk.bold.yellow(mode)} mode`);

    await dbHelper(server);
    await restifyHelper(server);
    await validateHelper(server);

    if (env === 'development') server.use(requestLogger());
    server.use(bodyParser());
    server.use(exceptionMiddleware());
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
