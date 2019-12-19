const restifyHelper = server => {
    server.context.restify = function(data = {}, status) {
        const { method } = this.request;
        this.response.body = {
            code: 0,
            msg: 'ok',
            data: method === 'DELETE' ? {} : data,
        };

        const statusMapper = new Map([
            ['GET', 200],
            ['POST', 201],
            ['DELETE', 204],
        ]);

        if (!status) {
            status = statusMapper.get(method);
        }
        this.status = status;
    };
};

module.exports = restifyHelper;
