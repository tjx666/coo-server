const { promisify } = require('util');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

const { appLogger } = require('./helpers/log').loggers;
const bootstrap = require('./bootstrap');
const { ENV } = require('../utils/constants');
const config = require('../configs');
const getPort = require('../utils/getPort');

const start = async () => {
    appLogger.info(`Startup server under ${chalk.bold.yellow(ENV)} mode`);

    const { host, port: defaultPort, address } = config.server;
    const port = await getPort(host, defaultPort);

    const app = await bootstrap();
    const server = await promisify(cb => {
        const httServer = app.listen(port, port, err => cb(err, httServer));
    })();

    app.appLogger.info(
        `Server is running at ${chalk.green.underline(address)} ${logSymbols.success}`,
    );

    return {
        app,
        server,
    };
};

if (ENV === 'test') {
    module.exports = start;
} else {
    start();
}
