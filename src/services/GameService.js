const db = require('../mongodb');
const { getRedisClient } = require('../redisdb');

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
 * @param {String} roomId
 * @returns {Array} jugadas
 */
async function getJugadas(roomId) {
    const redisClient = await getRedisClient();
    const jugadas = JSON.parse(await redisClient.get(`jugadas:${roomId}`) || '[]');
    return jugadas;
}

/**
 * @param {String} roomId
 * @param {Object} jugada
 * @returns {Array} jugadas
 */
async function pushJugada(roomId, jugada) {
    const redisClient = await getRedisClient();
    const jugadas = JSON.parse(await redisClient.get(`jugadas:${roomId}`) || '[]');
    jugadas.push(jugada);
    await redisClient.set(`jugadas:${roomId}`, JSON.stringify(jugadas));
    return jugadas;
}

module.exports = {
    findGame,
    getJugadas,
    pushJugada,
}
