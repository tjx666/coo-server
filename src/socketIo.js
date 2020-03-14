const SocketIO = require('socket.io');

module.exports = async function socketIo(app, server) {
    const io = SocketIO(server);
    // 挂载 io helper
    app.io = io;
    app.context.io = io;

    io.on('connection', function(socket) {
        console.log('a user connected');
    });
};
