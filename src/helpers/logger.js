const { resolve } = require('path');
const log4js = require('log4js');
const fs = require('fs-extra');

const projectRoot = resolve(__dirname, '../../');

const clearLogs = async () => {
    await fs.remove(projectRoot, './log');
};

const appLogPath = resolve(projectRoot, './logs/application.log');
const ctxLogPath = resolve(projectRoot, './logs/context.log');
const appErrorLogPath = resolve(projectRoot, './logs/application.error.log');
const ctxErrorLogPath = resolve(projectRoot, './logs/context.error.log');

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
        application: {
            appenders: ['appFile', 'appErrorFilter'],
            level: 'trace',
        },
        context: {
            appenders: ['ctxFile', 'ctxErrorFilter'],
            level: 'trace',
        },
    },
};

const notProd = ['development', 'test'].includes(process.env.NODE_ENV);
if (notProd) {
    configuration.categories.values(categoryConfig => {
        categoryConfig.appenders.push('console');
    });
}
log4js.configure(configuration);

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
