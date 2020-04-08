module.exports = function restifyHelper(app) {
    app.context.restify = function (data = {}, msg = 'success', status) {
        const ctx = this;
        const { method } = ctx.request;
        ctx.body = {
            code: 0,
            msg,
            data: method === 'DELETE' ? {} : data,
        };

        const methodStatusMapper = new Map([['DELETE', 204]]);
        if (!status) {
            status = methodStatusMapper.get(method) || 200;
        }
        this.status = status;
    };
};
