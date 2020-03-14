const { resolve } = require('path');
const { promisify } = require('util');
const rm = require('rimraf');

const log4js = require('../../configs/log4js.config');
const { PROJECT_ROOT } = require('../../utils/constants');

async function clearLogs() {
    await promisify(rm)(resolve(PROJECT_ROOT, './logs'));
}

const loggers = {
    appLogger: log4js.getLogger('application'),
    ctxLogger: log4js.getLogger('context'),
    logger: log4js.getLogger('console'),
    clearLogs,
};

function logHelper(app) {
    Object.assign(app, loggers);
    Object.assign(app.context, loggers);
}
logHelper.loggers = loggers;

module.exports = logHelper;
