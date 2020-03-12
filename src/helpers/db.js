const mongoose = require('mongoose');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

const configs = require('../../configs');

module.exports = async function dbHelper(server) {
    const { address, connectOptions } = configs.db;
    const { appLogger } = server;
    const colorizedAddr = chalk.green.underline(address);

    try {
        await mongoose.connect(address, connectOptions);
    } catch (error) {
        appLogger.error(`Connected to mongoDB at ${colorizedAddr} failed ${logSymbols.error}`);
        appLogger.error(error);
    }

    appLogger.info(`Connected to mongoDB at ${colorizedAddr} ${logSymbols.success}`);

    const db = mongoose.connection;
    server.db = db;
    server.context.db = db;

    db.on('close', () => {
        appLogger.warn(
            `MongoDB connection to at ${colorizedAddr} had been closed ${logSymbols.warning}`,
        );
    });

    db.on('error', err => {
        appLogger.error('MongoDB occurred error!');
        appLogger.error(err);
    });
};
