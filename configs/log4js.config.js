const { resolve } = require('path');
const log4js = require('log4js');

const { ENV, PROJECT_ROOT } = require('../utils/constants');

const appLogPath = resolve(PROJECT_ROOT, './logs/application.log');
const ctxLogPath = resolve(PROJECT_ROOT, './logs/context.log');
const appErrorLogPath = resolve(PROJECT_ROOT, './logs/application.error.log');
const ctxErrorLogPath = resolve(PROJECT_ROOT, './logs/context.error.log');

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

if (ENV === 'production') {
    Object.values(configuration.categories)
        .slice(1)
        .forEach(config => config.appenders.shift());
}

module.exports = log4js.configure(configuration);
