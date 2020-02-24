const Koa = require('koa');

const setupHelpers = require('./helpers');
const setupMiddlewares = require('./middlewares');

const bootstrap = async () => {
    const app = new Koa();
    await setupHelpers(app);
    await setupMiddlewares(app);
    return app;
};

module.exports = bootstrap;
