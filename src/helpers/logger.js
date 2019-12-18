const { resolve } = require('path');
const log4js = require('log4js');
const fs = require('fs-extra');

const projectRoot = resolve(__dirname, '../../');
const appLogPath = resolve(projectRoot, './logs/application.log');
const ctxLogPath = resolve(projectRoot, './logs/context.log');
const appErrorLogPath = resolve(projectRoot, './logs/application.error.log');
const ctxErrorLogPath = resolve(projectRoot, './logs/context.error.log');

log4js.configure({
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
            type: 'logLevelFilter',
            appender: 'appFile',
            filename: appErrorLogPath,
            level: 'error',
        },
        ctxErrorFile: {
            type: 'logLevelFilter',
            appender: 'ctxErrorDateFile',
            filename: ctxErrorLogPath,
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
            appenders: ['console', 'appFile', 'appErrorFile'],
            level: 'trace',
        },
        context: {
            appenders: ['console', 'ctxFile', 'ctxErrorFile'],
            level: 'trace',
        },
    },
});

const clearLogs = async () => {
    await fs.remove(projectRoot, './log');
};

const logHelpers = {
    appLogger: log4js.getLogger('application'),
    ctxLogger: log4js.getLogger('context'),
    logger: log4js.getLogger('console'),
    clearLogs,
};

const loggerHelper = server => {
    Object.assign(server, logHelpers);
    Object.assign(server.context, logHelpers);
};

module.exports = loggerHelper;
