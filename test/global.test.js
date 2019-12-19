const start = require('../src/index');

before(async () => {
    const { listeningServer, server } = await start();
    global.TEST_SERVER = listeningServer;
    global.SOURCE_TEST_SERVER = server;
});

after(async () => {
    await SOURCE_TEST_SERVER.db.close();
});
