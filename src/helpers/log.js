const { promisify } = require('util');
const log4js = require('log4js');
const rm = require('rimraf');

const { isProd, resolvePath, projectRoot } = require('../../utils/env');

async function clearLogs() {
    await promisify(rm)(resolvePath(projectRoot, './logs'));
}

const appLogPath = resolvePath(projectRoot, './logs/application.log');
const ctxLogPath = resolvePath(projectRoot, './logs/context.log');
const appErrorLogPath = resolvePath(projectRoot, './logs/application.error.log');
const ctxErrorLogPath = resolvePath(projectRoot, './logs/context.error.log');
const configuration = {
    appenders: {
        appFile: {
            type: 'dateFile',
            filename: appLogPath,
        },
        ctxFile: {
            type: 'dateFile',
            filename: ctxLogPath,
        },
        appErrorFile: {
            type: 'dateFile',
            filename: appErrorLogPath,
        },
        ctxErrorFile: {
            type: 'dateFile',
            filename: ctxErrorLogPath,
        },
        appErrorFilter: {
            type: 'logLevelFilter',
            appender: 'appErrorFile',
            level: 'error',
        },
        ctxErrorFilter: {
            type: 'logLevelFilter',
            appender: 'ctxErrorFile',
            level: 'error',
        },
        console: {
            type: 'console',
            layout: {
                type: 'pattern',
                pattern: '%[[%p] %c%] - %m',
            },
        },
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'trace',
        },
        application: {
            appenders: ['console', 'appFile', 'appErrorFilter'],
            level: 'trace',
        },
        context: {
            appenders: ['console', 'ctxFile', 'ctxErrorFilter'],
            level: 'trace',
        },
    },
};

if (isProd) {
    Object.values(configuration.categories)
        .slice(1)
        .forEach(config => config.appenders.shift());
}
log4js.configure(configuration);

const loggers = {
    appLogger: log4js.getLogger('application'),
    ctxLogger: log4js.getLogger('context'),
    logger: log4js.getLogger('console'),
    clearLogs,
};

function logHelper(server) {
    Object.assign(server, loggers);
    Object.assign(server.context, loggers);
}
logHelper.helpers = loggers;

module.exports = logHelper;
