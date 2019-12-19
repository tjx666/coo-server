const { argv } = require('yargs');

exports.server = {
    hostname: argv.HOST || process.env.HOST || '127.0.0.1',
    port: Number(argv.PORT || process.env.PORT || 3001),
};

exports.db = {
    dbName: 'coo-test',
    hostname: '127.0.0.1',
    port: 27017,
};
