const multer = require('multer');

const config = require('../../configs');

module.exports = function exceptionMiddleware(opts) {
    opts = { apiPrefix: '/api/', ...opts };
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if (ctx.request.url.startsWith(opts.apiPrefix)) {
                ctx.ctxLogger.error(err);

                if (err.status === 401) {
                    // JWT 认证失败
                    ctx.response.status = 401;
                    ctx.body = {
                        code: 401,
                        msg: 'please login first!',
                    };
                } else if (err.isBoom) {
                    ctx.response.status = err.output.statusCode || 500;
                    ctx.response.body = {
                        code: (err.data && err.data.code) || ctx.response.status,
                        msg:
                            (err.data && err.data.msg) ||
                            err.message ||
                            err.output.payload.message ||
                            err.output.payload.error,
                    };
                } else if (err instanceof multer.MulterError) {
                    ctx.response.status = 400;
                    ctx.response.body = {
                        code: -1,
                        // prettier-ignore
                        msg: err.code === 'LIMIT_FILE_SIZE'
                                ? `max image size is ${config.server.maxAvatarSize / (1024 * 1024)}m`
                                : err.message
                    };
                } else {
                    ctx.response.status = err.status || err.statusCode || 500;
                    ctx.response.body = {
                        code: err.code || err.ctx.response.status,
                        msg: err.msg || err.message || 'An internal server error occurred',
                    };
                }
            } else {
                throw err;
            }
        }
    };
};
