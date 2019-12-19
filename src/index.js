//     ____   U  ___ u   U  ___ u
//  U /"___|   \/"_ \/    \/"_ \/
//  \| | u     | | | |    | | | |
//   | |/__.-,_| |_| |.-,_| |_| |
//    \____|\_)-\___/  \_)-\___/
//   _// \\      \\         \\
//  (__)(__)    (__)       (__)

const env = process.env.NODE_ENV;

const chalk = require('chalk');
const config = require(`../configs/${env}.config`);
const bootstrap = require('./bootstrap');

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
                `Server is successfully running at ${chalk.green.underline(
                    serverAddr
                )}`
            );
            resolve(listeningServer);
        });
    });
};

const start = async () => {
    const server = await bootstrap();
    const listeningServer = await listen(server);
    return {
        listeningServer,
        server,
    };
};

if (env !== 'test') {
    start();
} else {
    module.exports = start;
}
