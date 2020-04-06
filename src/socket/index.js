const SocketIO = require('socket.io');
const chalk = require('chalk');

const { appLogger } = require('../helpers/log').loggers;
const authenticationMiddleware = require('./middlewares/authentication');

module.exports = async function socketIo(app, server) {
    const io = SocketIO(server, {
        path: '/io',
        serveClient: false,
    });
    app.context.io = io;
    io.use(authenticationMiddleware);

    // 保存用户 id 和 socket 的映射
    const sockets = new Map();
    app.context.sockets = sockets;

    let autoIncrement = 0;
    io.on('connection', (socket) => {
        const { id } = socket.handshake.query;
        sockets.set(id, socket);

        ++autoIncrement;
        const connectionId = autoIncrement;
        const socketIdStr = chalk.bgBlue.black(` ${connectionId} `);
        const userIdStr = chalk.green(id);
        appLogger.info(`${socketIdStr} user ${userIdStr} connected!`);

        socket.on('disconnect', (_reason) => {
            if (sockets.get(id) === socket) {
                sockets.delete(id);
            }
            appLogger.info(`${socketIdStr} user ${userIdStr} disconnected!`);
        });
    });
};
