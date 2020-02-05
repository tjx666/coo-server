const { promisify } = require('util');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

const loggerHelpers = require('./helpers/logger');
const bootstrap = require('./bootstrap');
const { env: mode } = require('../utils/env');
const config = require('../configs');

const { appLogger } = loggerHelpers.helpers;

const start = async () => {
    appLogger.info(`Startup server under ${chalk.bold.yellow(mode)} mode`);

    const app = await bootstrap();
    const { hostname, port, address } = config.server;
    const server = await promisify(cb => {
        const httServer = app.listen(port, hostname, err => cb(err, httServer));
    })();

    app.appLogger.info(`Server is running at ${chalk.green.underline(address)} ${logSymbols.success}`);

    return {
        app,
        server,
    };
};

process.on('unhandledRejection', err => {
    appLogger.error(err);
});

if (mode !== 'test') {
    start();
} else {
    module.exports = start;
}
