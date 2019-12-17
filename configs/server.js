const { argv } = require('yargs');

const serverConfig = {
    HOST: String(argv.HOST || process.env.HOST || '127.0.0.1'),
    PORT: Number(argv.PORT || process.env.PORT || '3000'),
};

module.exports = serverConfig;
