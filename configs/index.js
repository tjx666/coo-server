const { ENV } = require('../utils/constants');

const configModuleMap = {
    development: 'base',
    test: 'test',
    production: 'prod',
};
const config = require(`./${configModuleMap[ENV]}.config`);

const { server: serverConfig, db: dbConfig } = config;
serverConfig.address = `http://${serverConfig.host}:${serverConfig.port}`;
dbConfig.address = `mongodb://${dbConfig.hostname}:${dbConfig.port}/${dbConfig.dbName}`;

module.exports = config;
