const mongoose = require('mongoose');
const chalk = require('chalk');
const dbConfig = require('../../configs/db');
const { User } = require('../models');

const dbHelper = async server => {
    const { dbName, host, port } = dbConfig;
    const { appLogger } = server;
    const connectAddr = chalk.green.underline(
        `mongodb://${host}:${port}/${dbName}`
    );

    try {
        await mongoose.connect(connectAddr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        appLogger.error(`Connect to mongoDB at ${connectAddr} failed!`);
        if (err) appLogger.error(err);
    }

    appLogger.info(`Connected to mongoDB at ${connectAddr} success!`);

    const db = mongoose.connection;

    db.on('close', () => {
        appLogger.warn(
            `MongoDB connection to at ${connectAddr} had been closed!`
        );
    });

    db.on('error', err => {
        appLogger.error('MongoDB occurred error!');
        if (err) appLogger.error(err);
    });
};

module.exports = dbHelper;
