const restifyHelper = server => {
    server.context.restify = function(data = {}, status) {
        this.response.body = {
            code: 0,
            msg: 'ok',
            data,
        };

        if (!status) {
            status = this.request.method === 'POST' ? 201 : 200;
        }
        this.status = status;
    };
};

module.exports = restifyHelper;
