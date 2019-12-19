//     ____   U  ___ u   U  ___ u
//  U /"___|   \/"_ \/    \/"_ \/
//  \| | u     | | | |    | | | |
//   | |/__.-,_| |_| |.-,_| |_| |
//    \____|\_)-\___/  \_)-\___/
//   _// \\      \\         \\
//  (__)(__)    (__)       (__)

/* eslint-disable new-cap */
const chalk = require('chalk');
const { server: serverConfig } = require('../configs/development.config');
const bootstrap = require('./server');

const start = async () => {
    const server = await bootstrap();
    const { hostname, port } = serverConfig;

    server.listen(port, hostname, () => {
        const serverAddr = `http://${hostname}:${port}`;
        server.appLogger.info(
            `Server is successfully running at ${chalk.green.underline(
                serverAddr
            )}`
        );
    });
};

start();
