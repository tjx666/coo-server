const multer = require('multer');

const config = require('../../configs');

module.exports = function exceptionMiddleware(opts) {
    opts = { apiPrefix: '/api/', ...opts };
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            if (ctx.request.url.startsWith(opts.apiPrefix)) {
                ctx.ctxLogger.error(error);

                if (error.status === 401) {
                    // JWT 认证失败
                    ctx.response.status = 401;
                    ctx.body = {
                        code: 401,
                        msg: 'please login first!',
                    };
                } else if (error.isBoom) {
                    ctx.response.status = error.output.statusCode || 500;
                    ctx.response.body = {
                        code: (error.data && error.data.code) || ctx.response.status,
                        msg:
                            (error.data && error.data.msg) ||
                            error.message ||
                            error.output.payload.message ||
                            error.output.payload.error,
                    };
                } else if (error instanceof multer.MulterError) {
                    ctx.response.status = 400;
                    ctx.response.body = {
                        code: -1,
                        // prettier-ignore
                        msg: error.code === 'LIMIT_FILE_SIZE'
                                ? `max image size is ${config.server.maxAvatarSize / (1024 * 1024)}m`
                                : error.message
                    };
                } else {
                    ctx.response.status = error.status || error.statusCode || 500;
                    ctx.response.body = {
                        code: error.code || ctx.response.status,
                        msg: error.msg || error.message || 'An internal server error occurred',
                    };
                }
            } else {
                throw error;
            }
        }
    };
};
