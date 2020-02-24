const merge = require('lodash/merge');
const uuid = require('uuid/v1');
const devConfig = require('./base.config');

exports.server = {
    port: 8080,
};

exports.security = {
    jwtSecret: process.env.JWT_SECRET || uuid(),
    passwordHashSaltRounds: process.env.PWD_HASH_SALT || Math.floor(5 + Math.random() * 11),
};

exports.db = {
    dbName: 'coo',
};

module.exports = merge(devConfig, exports);
