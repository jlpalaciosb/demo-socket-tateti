const { Server } = require('socket.io');
const { findGame } = require('./services/GameService');

function initSocket(server) {
    const io = new Server(server);

    io.use(async (socket, next) => {
        const username = socket.handshake.auth.username;
        const roomId = socket.handshake.auth.roomId;
        const game = await findGame(roomId);

        if (!username) {
            return next(new Error("no username"));
        }
        if (!roomId) {
            return next(new Error("no room"));
        } else {
            if (!game) {
                return next(new Error("invalid game room"));
            } else if (game.playerX != username && game.playerO != username) {
                return next(new Error("invalid game player"));
            }
        }

        socket.username = username;
        socket.roomId = roomId;
        socket.game = game;

        next();
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.username, socket.roomId);

        socket.join(socket.roomId);

        for (let [id, socket] of io.of("/").sockets) {
            console.log('socket /', id, socket.username);
        }

        socket.on("jugada", ({ content, to }) => {
            socket.to(socket.roomId).emit("jugada", {
                content,
                from: socket.id,
                fromPlayer: socket.username,
                mark: socket.game.playerX == socket.username ? 'X' : 'O',
            });
        });

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id, socket.username);
        });
    });
}

module.exports = initSocket;