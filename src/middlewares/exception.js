const exceptionMiddleware = ({ apiPrefix = '/api/' } = {}) => {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.appLogger.error(err);
            const {
                code,
                msg,
                message,
                status,
                statusCode,
                output,
                data,
            } = err;
            if (ctx.request.url.startsWith(apiPrefix)) {
                if (err.isBoom) {
                    // using Boom
                    ctx.response.status = output.statusCode || 500;
                    ctx.response.body = {
                        code: data.code || ctx.response.status,
                        msg:
                            data.msg ||
                            message ||
                            output.payload.message ||
                            output.payload.error,
                    };
                } else {
                    // using ctx.throw or others
                    ctx.response.status = status || statusCode || 500;
                    ctx.response.body = {
                        code: code || ctx.response.status,
                        msg:
                            msg ||
                            message ||
                            'An internal server error occurred',
                    };
                }
            }
        }
    };
};

module.exports = exceptionMiddleware;