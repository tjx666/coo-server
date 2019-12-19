const request = require('supertest');

describe('#user API', () => {
    describe('#create user', () => {
        it(`should return { code: 0, msg: 'ok', data: {} }`, async () => {
            await request(TEST_SERVER)
                .post('/api/v1/users')
                .send({ name: 'yy', age: 18 })
                .expect(201);
        });
    });
});
