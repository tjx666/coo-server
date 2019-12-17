const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const chalk = require('chalk');
const serverConfig = require('../configs/server');

const server = new Koa();

server.use(bodyParser());

const { HOST, PORT } = serverConfig;
server.listen(PORT, HOST, () => {
    const serverAddr = `http://${HOST}:${PORT}`;
    console.log(`Server is running at ${chalk.green.underline(serverAddr)}`);
});
