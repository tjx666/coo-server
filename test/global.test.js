const mongoose = require('mongoose');
const supertest = require('supertest');
const logSymbols = require('log-symbols');

const start = require('../src/index');
const config = require('../configs');
const { appLogger } = require('../src/helpers/logger').helpers;
const { userService } = require('../src/services');

before(async () => {
    // destroy old test db
    const { dbName, hostname, port, connectOptions } = config.db;
    const conn = await mongoose.createConnection(
        `mongodb://${hostname}:${port}/${dbName}`,
        connectOptions
    );
    await conn.dropDatabase();
    appLogger.info(`Drop old database ${dbName} ${logSymbols.success}`);

    // startup server
    const { listeningServer, server } = await start();
    global.__test_server__ = server;

    // add some test data
    const testUsers = [
        {
            name: 'test',
            password: 'test',
            age: 16,
        },
        {
            name: 'ly1',
            password: 'hash(666666)',
            age: 21,
        },
        {
            name: 'ly2',
            password: 'hash(999999)',
            age: 18,
        },
    ];
    await Promise.all(testUsers.map(user => userService.createUser(user)));

    // get jwt
    const resp = await supertest(listeningServer)
        .post('/api/v1/users/login')
        .send({ name: 'test', password: 'test' })
        .expect(200);
    const jwtToken = resp.body.data;

    // setup global request util
    global.request = supertest
        .agent(listeningServer)
        .set('Authorization', `Bearer ${jwtToken}`);
});

after(async () => {
    await global.__test_server__.db.close();
});
