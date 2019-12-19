const Koa = require('koa');
const Boom = require('@hapi/boom');

const server = new Koa();
const Router = require('koa-router');

const router = new Router();

server.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log(err);
    }
});

router.get('/', (ctx, next) => {
    throw Boom.badRequest();
});

server.use(router.routes());

server.listen(3001, 'localhost', () => {
    console.log('server started!');
});
