const chalk = require('chalk');
const bootstrap = require('../src/server');
const { server: serverConfig } = require('../configs/test.config');

// eslint-disable-next-line no-shadow
const listen = server => {
    return new Promise((resolve, reject) => {
        const { hostname, port } = serverConfig;
        const listenedServer = server.listen(port, hostname, err => {
            if (err) {
                reject(err);
                return;
            }

            const serverAddr = `http://${hostname}:${port}`;
            console.log(
                `Test server running at ${chalk.green.underline(serverAddr)}`
            );
            resolve(listenedServer);
        });
    });
};

before(async () => {
    const server = await bootstrap();
    const listenedServer = await listen(server);
    global.TEST_SERVER = listenedServer;
    global.SOURCE_TEST_SERVER = server;
});

after(async () => {
    SOURCE_TEST_SERVER.db.close();
});
