const { argv } = require('yargs');

const serverConfig = {
    hostname: argv.HOST || process.env.HOST || '127.0.0.1',
    port: Number(argv.PORT || process.env.PORT || 3000),
};

module.exports = serverConfig;
