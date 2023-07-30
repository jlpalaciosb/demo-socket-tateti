const { Server } = require('socket.io');
const { findGame, pushJugada, checkGameFin, setGameFin, newGame } = require('../services/GameService');
const { pushToLobby, popFromLobby, getLobby } = require('../services/PairingService');

function initSocket(server) {
    const io = new Server(server);

    io.use(async (socket, next) => {
        const username = socket.handshake.auth.username;
        if (username) {
            socket.username = username;
        } else {
            return next(new Error("no username"));
        }

        if (socket.handshake.auth.tipoSocket == 'gameplay') {
            socket.tipoSocket = 'gameplay';
            const roomId = socket.handshake.auth.roomId;
            if (roomId) {
                socket.roomId = roomId;
                const game = await findGame(roomId);
                if (game) {
                    socket.game = game;
                    if (game.playerX != username && game.playerO != username) {
                        console.log('usuario espectador', username, roomId);
                    }
                } else {
                    return next(new Error("no game with room id"));
                }
            } else {
                return next(new Error("no gameplay room id"));
            }
        }

        if (socket.handshake.auth.tipoSocket == 'pairing') {
            socket.tipoSocket = 'pairing';
        }

        next();
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket.tipoSocket, socket.username);

        if (socket.tipoSocket == 'gameplay') {
            socket.join(socket.roomId);
            socket.on("jugada", async ({ content, to }) => {
                console.log('jugada', socket.username, content.x, content.y);
                if (socket.game.playerX == socket.username || socket.game.playerO == socket.username) {
                    if (!socket.game.fin) {
                        let jugada = {
                            x: content.x,
                            y: content.y,
                            mark: socket.game.playerX == socket.username ? 'X' : 'O',
                        }
                        const jugadas = await pushJugada(socket.roomId, jugada);
                        if (checkGameFin(jugadas)) {
                            setGameFin(socket.roomId, jugadas);
                        }
                        socket.to(socket.roomId).emit("jugada", {
                            content,
                            mark: jugada.mark,
                            from: socket.id,
                            fromPlayer: socket.username,
                        });
                    } else {
                        console.log('partida ya terminada');
                    }
                } else {
                    console.log('jugador no es de la partida');
                }
            });
        }

        if (socket.tipoSocket == 'pairing') {
            socket.join('lobby');
            socket.on('peticion', async ({ content, to }) => {
                await pushToLobby(socket.username);
                console.log('peticion: current lobby', await getLobby());
                let pairedPlayers = await popFromLobby();
                if (pairedPlayers) {
                    const objNewGame = await newGame(pairedPlayers.playerX, pairedPlayers.playerO);
                    io.to('lobby').emit("newGame", objNewGame);
                }
            });
        }

        // for (let [id, socket] of io.of("/").sockets) {
        //     console.log('socket /', id, socket.username);
        // }

        socket.on('disconnect', () => {
            console.log('user disconnected', socket.id, socket.username);
        });
    });
}

module.exports = initSocket;
