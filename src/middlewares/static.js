const koaStatic = require('koa-static');

const { PROJECT_ROOT } = require('../../utils/constants');

// 强缓存时间为 2 周
const twoWeeks = 1000 * 60 * 60 * 7 * 2;
// 请求头像的 url 没有文件后缀，所以这里要配置默认查找的后缀
const serveAvatar = koaStatic(PROJECT_ROOT, {
    maxage: twoWeeks,
    // 只支持 png 和 jpg 格式头像
    extensions: ['png', 'jpg'],
});
const serveOthers = koaStatic(PROJECT_ROOT, { maxage: twoWeeks });

module.exports = function staticService(opts = {}) {
    return async (ctx, next) => {
        // 静态资源 path 必须 /public 开头
        if (ctx.url.startsWith('/public')) {
            if (ctx.url.startsWith('/public/images/avatar')) {
                await serveAvatar(ctx, next);
            } else {
                await serveOthers(ctx, next);
            }
        } else {
            await next();
        }
    };
};
