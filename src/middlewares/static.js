const koaStatic = require('koa-static');

const { PROJECT_ROOT } = require('../../utils/constants');

// 强缓存时间为 2 周
const strongCacheMaxAge = 1000 * 60 * 60 * 7 * 2;
const staticServe = koaStatic(PROJECT_ROOT, { maxage: strongCacheMaxAge });

module.exports = function staticService(opts = {}) {
    return async (ctx, next) => {
        // 静态资源 path 必须 /public 开头
        if (ctx.url.startsWith('/public')) {
            await staticServe(ctx, next);
        } else {
            await next();
        }
    };
};
