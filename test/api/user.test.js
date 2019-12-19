const request = require('supertest');

describe('#user API', () => {
    describe('#create user', () => {
        it(`success create should return { code: 0, msg: 'ok', data: {} }`, async () => {
            await request(TEST_SERVER)
                .post('/api/v1/users')
                .send({ name: 'yy', age: 18 })
                .expect(201, {
                    code: 0,
                    msg: 'ok',
                    data: {},
                });
        });

        it(`bad request should return { code: 400, msg: 'xxx' }`, async () => {
            await request(TEST_SERVER)
                .post('/api/v1/users')
                .send({ age: 18 })
                .expect(400, {
                    code: 400,
                    msg: `"name" is required`,
                });
        });
    });
});
