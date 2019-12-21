const _ = require('lodash');
const devConfig = require('./development.config');

exports.server = {
    port: 3001,
};

exports.security = {
    jwtSecret: 'test_jwt_secret',
};

exports.db = {
    dbName: 'coo-test',
};

module.exports = _.merge(devConfig, exports);
