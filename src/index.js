const { promisify } = require('util');
const Koa = require('koa');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

const setupHelpers = require('./helpers');
const setupMiddlewares = require('./middlewares');

const config = require('../configs');
const { appLogger } = require('./helpers/log').loggers;

const getPort = require('../utils/getPort');
const { ENV } = require('../utils/constants');
const socketIo = require('./socketIo');

const start = async () => {
    const app = new Koa();

    await setupHelpers(app);
    await setupMiddlewares(app);

    const { host, port: defaultPort, address } = config.server;
    const port = await getPort(host, defaultPort);
    const server = await promisify(cb => {
        appLogger.info(`Startup server under ${chalk.bold.yellow(ENV)} mode`);
        const httServer = app.listen(port, port, err => cb(err, httServer));
    })();
    await socketIo(app, server);

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
} else if (require.main === module) {
    start();
}
