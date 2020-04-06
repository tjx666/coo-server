const SocketIO = require('socket.io');

const authenticationMiddleware = require('./middlewares/authentication');

module.exports = async function socketIo(app, server) {
    const io = SocketIO(server, {
        path: '/io',
        serveClient: false,
    });
    app.context.io = io;
    io.use(authenticationMiddleware);

    // 保存用户 id 和 socket 的映射
    const sockets = new Map([]);
    app.context.sockets = sockets;

    let autoIncrement = 0;
    io.on('connection', (socket) => {
        const { id } = socket.handshake.query;
        // eslint-disable-next-line no-plusplus
        ++autoIncrement;
        const connectionId = autoIncrement;
        console.log(`[${connectionId}] user ${id} connected!`);
        sockets.set(id, socket);

        socket.on('disconnect', (reason) => {
            if (sockets.get(id) === socket) {
                sockets.delete(id);
            }
            console.log(`[${connectionId}] user ${id} disconnected!`);
        });
    });
};
