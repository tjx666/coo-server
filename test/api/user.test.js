const assert = require('assert');

describe('#user API', () => {
    describe('#user register', () => {
        const registerURL = '/api/v1/users/register';

        it('register user success', async () => {
            const {
                body: { data },
            } = await request
                .post(registerURL)
                .send({ email: 'a@b.com', name: 'ly', password: '9999999' })
                .expect(201);
        });

        it(`bad request should return { code: 400, msg: 'xxx' }`, async () => {
            await request
                .post(registerURL)
                .send({ email: 'a@b.com', password: '666' })
                .expect(400, {
                    code: -1,
                    msg: `"name" is required`,
                });
        });
    });

    describe('#test get users', () => {
        it('get all users success', async () => {
            const {
                body: { data: users },
            } = await request.get('/api/v1/users').expect(200);

            assert.ok(users.length > 0);
        });
    });
});
