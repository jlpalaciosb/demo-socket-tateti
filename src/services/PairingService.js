const { getRedisClient } = require('../database/redisdb');

/**
 * @returns {Array} queue
 */
async function getLobby() {
    const redisClient = await getRedisClient();
    const lobby = await redisClient.lRange('lLobby', 0, -1);
    return lobby;
}

/**
 * @param {String} username que quiere jugar
 * @returns {Array} queue
 */
async function pushToLobby(username) {
    const redisClient = await getRedisClient();
    let lobby = await redisClient.lRange('lLobby', 0, -1);
    if (!lobby.includes(username)) {
        await redisClient.rPush('lLobby', username);
    }
    return lobby;
}

/**
 * @returns {Object|Boolean} { playerX, playerO } | false
 */
async function popFromLobby() {
    const redisClient = await getRedisClient();
    let lobbyLen = await redisClient.lLen('lLobby');
    if (lobbyLen >= 2) {
        let players = [
            await redisClient.lPop('lLobby'),
            await redisClient.lPop('lLobby'),
        ];
        if (Math.random() < 0.5) {
            return {
                playerX: players[0],
                playerO: players[1],
            };
        } else {
            return {
                playerX: players[1],
                playerO: players[0],
            };
        }
    } else {
        return false; // not enough players
    }
}

module.exports = {
    getLobby,
    pushToLobby,
    popFromLobby,
}
