module.exports = function exceptionMiddleware(opts) {
    opts = { apiPrefix: '/api/', ...opts };
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if (ctx.request.url.startsWith(opts.apiPrefix)) {
                ctx.ctxLogger.error(err);

                const { code, msg, message, status, statusCode, output, data } = err;

                if (err.status === 401) {
                    // JWT 认证失败
                    ctx.ctxLogger.error(err);
                    ctx.response.status = 401;
                    ctx.body = {
                        code: 401,
                        msg: 'please login first!',
                    };
                } else if (err.isBoom) {
                    ctx.response.status = output.statusCode || 500;
                    ctx.response.body = {
                        code: (data && data.code) || ctx.response.status,
                        msg: (data && data.msg) || message || output.payload.message || output.payload.error,
                    };
                } else {
                    ctx.response.status = status || statusCode || 500;
                    ctx.response.body = {
                        code: code || ctx.response.status,
                        msg: msg || message || 'An internal server error occurred',
                    };
                }
            } else {
                throw err;
            }
        }
    };
};
