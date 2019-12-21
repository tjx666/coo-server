//     ____   U  ___ u   U  ___ u
//  U /"___|   \/"_ \/    \/"_ \/
//  \| | u     | | | |    | | | |
//   | |/__.-,_| |_| |.-,_| |_| |
//    \____|\_)-\___/  \_)-\___/
//   _// \\      \\         \\
//  (__)(__)    (__)       (__)

const chalk = require('chalk');
const logSymbols = require('log-symbols');
const bootstrap = require('./bootstrap');
const config = require(`../configs`);

const listen = server => {
    return new Promise((resolve, reject) => {
        const { hostname, port } = config.server;
        const listeningServer = server.listen(port, hostname, err => {
            if (err) {
                reject(err);
                return;
            }

            const serverAddr = `http://${hostname}:${port}`;
            server.appLogger.info(
                // prettier-ignore
                `Server is running at ${chalk.green.underline(serverAddr)} ${logSymbols.success}`
            );
            resolve(listeningServer);
        });
    });
};

const start = async () => {
    const server = await bootstrap();
    const listeningServer = await listen(server);

    process.on('unhandledRejection', err => {
        server.appLogger.error(err);
    });

    return {
        listeningServer,
        server,
    };
};

if (require('../utils/env').env !== 'test') {
    start();
} else {
    module.exports = start;
}
