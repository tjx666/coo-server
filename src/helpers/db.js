const mongoose = require('mongoose');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const config = require(`../../configs/${process.env.NODE_ENV}.config`);

const dbHelper = async server => {
    const { dbName, hostname, port } = config.db;
    const { appLogger } = server;
    const connectAddr = `mongodb://${hostname}:${port}/${dbName}`;
    const colorizedAddr = chalk.green.underline(connectAddr);

    try {
        await mongoose.connect(connectAddr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        appLogger.error(`Connect to mongoDB at ${colorizedAddr} failed!`);
        if (err) appLogger.error(err);
    }

    appLogger.info(
        `Connected to mongoDB at ${colorizedAddr} ${logSymbols.success}`
    );

    const db = mongoose.connection;
    server.db = db;
    server.context.db = db;

    db.on('close', () => {
        appLogger.warn(
            `MongoDB connection to at ${colorizedAddr} had been closed!`
        );
    });

    db.on('error', err => {
        appLogger.error('MongoDB occurred error!');
        if (err) appLogger.error(err);
    });
};

module.exports = dbHelper;
