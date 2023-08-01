const db = require('../database/mongodb');
const { getRedisClient } = require('../database/redisdb');

const lineasGanadores = [
    [[1, 1], [2, 1], [3, 1]],
    [[1, 2], [2, 2], [3, 2]],
    [[1, 3], [2, 3], [3, 3]],
    [[1, 1], [1, 2], [1, 3]],
    [[2, 1], [2, 2], [2, 3]],
    [[3, 1], [3, 2], [3, 3]],
    [[1, 1], [2, 2], [3, 3]],
    [[3, 1], [2, 2], [1, 3]],
];

/**
 * Encontrar partida por clave del room
 * @param {String} roomId clave del room
 * @returns {Object} instancia de la partida ó null
 */
async function findGame(roomId) {
    const games = db.collection('games');
    const query = { roomId };
    const game = await games.findOne(query);
    return game;
}

/**
 * @returns {String}
 */
function newRoomId() {
    let cadena = '';
    const caracteres = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 8; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      cadena += caracteres.charAt(indiceAleatorio);
    }
    return cadena;
}

/**
 * Engendra una nueva partida
 * @param {String} playerX clave del room
 * @param {String} playerO clave del room
 * @returns {Object} instancia de la nueva partida
 */
async function newGame(playerX, playerO) {
    const games = db.collection('games');
    const newGame = {
        roomId: newRoomId(),
        playerX,
        playerO,
    };
    await games.insertOne(newGame);
    return newGame;
}

/**
 * Finalizar una partida
 * @param {String} roomId clave del room
 * @returns {Object} instancia de la partida ó null
 */
async function setGameFin(roomId, jugadas) {
    const games = db.collection('games');
    const game = await games.findOne({ roomId });
    if (game != null) {
        games.updateOne({ roomId }, {
            $set: {
                fin: true,
                jugadas,
            }
        });
    }
    return game;
}

/**
 * @param {String} roomId
 * @returns {Array} jugadas
 */
async function getJugadas(roomId) {
    const game = await findGame(roomId);
    if (game.fin) {
        return game.jugadas;
    } else {
        const redisClient = await getRedisClient();
        const jugadasRet = await redisClient.lRange(`jugadas:${roomId}`, 0, -1);
        return jugadasRet.map(j => {
            const [x, y, mark] = j.split(',');
            return {x, y, mark};
        });
    }
}

/**
 * @param {String} roomId
 * @param {Object} objJugadaPush { x, y, mark }
 * @returns {Array} jugadas [{ x, y, mark }]
 */
async function pushJugada(roomId, objJugadaPush) {
    const redisClient = await getRedisClient();
    const jugadasOri = await redisClient.lRange(`jugadas:${roomId}`, 0, -1);
    const strJugadaPush = `${objJugadaPush.x},${objJugadaPush.y},${objJugadaPush.mark}`;
    const jugadasNew = [...jugadasOri, strJugadaPush];
    let jugadasRet = [];
    if (isValidJugadas(jugadasNew)) {
        await redisClient.rPush(`jugadas:${roomId}`, strJugadaPush);
        jugadasRet = jugadasNew;
    } else {
        jugadasRet = jugadasOri;
    }
    return jugadasRet.map(j => {
        const [x, y, mark] = j.split(',');
        return {x, y, mark};
    });
}

/**
 * @param {Array} jugadas ['x,y,mark']
 * @returns {Boolean} 
 */
function isValidJugadas(jugadas) {
    let cntX = jugadas.filter(j => j.includes('X')).length;
    let cntO = jugadas.filter(j => j.includes('O')).length;
    if (cntO + cntX > 9) {
        return false
    } else if (cntO > cntX) {
        return false;
    } else if (cntX > cntO + 1) {
        return false;
    } else {
        return true;
    }
}

function getCellMark(jugadas, x, y) {
    let j = jugadas.filter(jug => jug.x == x && jug.y == y);
    if (j[0]) return j[0].mark;
    else return '';
}

function checkGameFin(jugadas) {
    let markWin = false;
    lineasGanadores.forEach(linea => {
        let win = false;
        let m = getCellMark(jugadas, linea[0][0], linea[0][1]);
        if (m && getCellMark(jugadas, linea[1][0], linea[1][1]) == m && getCellMark(jugadas, linea[2][0], linea[2][1]) == m) {
            win = true;
            markWin = m;
        }
    });
    if (markWin || jugadas.length == 9) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    findGame,
    newGame,
    getJugadas,
    pushJugada,
    setGameFin,
    checkGameFin,
}
