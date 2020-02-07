const assert = require('assert');

const { equal } = assert;

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

            equal(data.user.name, 'ly');
        });

        it(`bad request should return { code: 400, msg: 'xxx' }`, async () => {
            await request
                .post(registerURL)
                .send({ email: 'a@b.com', password: '666' })
                .expect(400, {
                    code: 400,
                    msg: `"name" is required`,
                });
        });
    });

    describe('#test get users', async () => {
        it('get all users success', async () => {
            const {
                body: { data: users },
            } = await request.get('/api/v1/users').expect(200);

            assert(users.length > 0);
        });
    });
});
