const mongoose = require('mongoose');
const supertest = require('supertest');
const logSymbols = require('log-symbols');

const { appLogger } = require('../src/helpers/logger').helpers;
const { userService } = require('../src/services');

const start = require('../src/index');
const config = require('../configs');

before(async function() {
    this.timeout(10 * 1000);

    // destroy old test db
    const { dbName, address, connectOptions } = config.db;
    const conn = await mongoose.createConnection(address, connectOptions);
    await conn.dropDatabase();
    await conn.close();
    appLogger.info(`drop old database ${dbName} ${logSymbols.success}`);

    // startup server
    const { app, server } = await start();
    global.__test_app__ = app;

    // add some test data
    const testUsers = [
        {
            email: 'a@gmail.com',
            name: 'ly1',
            password: 'p1',
        },
        {
            email: 'b@gmail.com',
            name: 'ly2',
            password: 'p2',
        },
        {
            email: 'c@gmail.com',
            name: 'ly3',
            password: 'p3',
        },
    ];
    await Promise.all(testUsers.map(user => userService.createUser(user)));

    // get jwt
    const resp = await supertest(server)
        .post('/api/v1/users/login')
        .send({ email: 'a@gmail.com', password: 'p1' })
        .expect(200);
    const token = resp.body.data;

    // setup global request util
    global.request = supertest.agent(server).set('Authorization', token);
    appLogger.info(`setup JWT ${logSymbols.success}`);
});

after(async () => {
    await global.__test_app__.db.close();
});
