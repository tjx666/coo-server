const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const requestLogger = require('koa-logger');
const chalk = require('chalk');
const loggerHelpers = require('./helpers/logger');
const dbHelper = require('./helpers/db');
const serverConfig = require('../configs/server');

const start = async () => {
    const server = new Koa();

    await loggerHelpers(server);
    const { appLogger } = server;
    const mode = process.env.NODE_ENV || 'production';
    appLogger.info(`Startup server under ${chalk.bold.yellow(mode)} mode`);

    await dbHelper(server);

    server.use(requestLogger());
    server.use(bodyParser());

    const { HOST, PORT } = serverConfig;
    server.listen(PORT, HOST, () => {
        const serverAddr = `http://${HOST}:${PORT}`;
        appLogger.info(
            `Server is successfully running at ${chalk.green.underline(
                serverAddr
            )}`
        );
    });
};

start();
