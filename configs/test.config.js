const merge = require('lodash/merge');
const devConfig = require('./base.config');

exports.server = {
    port: 8000,
};

exports.security = {
    jwtSecret: 'test_jwt_secret',
    passwordHashSaltRounds: 15,
};

exports.db = {
    dbName: 'coo-test',
};

module.exports = merge(devConfig, exports);
