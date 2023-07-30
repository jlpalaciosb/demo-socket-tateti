const { getRedisClient } = require('../database/redisdb');

/**
 * @returns {Array} queue
 */
async function getLobby() {
    const redisClient = await getRedisClient();
    const lobby = JSON.parse(await redisClient.get(`lobby`) || '[]');
    return lobby;
}

/**
 * @param {String} username que quiere jugar
 * @returns {Array} queue
 */
async function pushToLobby(username) {
    const redisClient = await getRedisClient();
    let lobby = JSON.parse(await redisClient.get(`lobby`) || '[]');
    if (!lobby.includes(username)) {
        lobby = [...lobby, username];
        await redisClient.set(`lobby`, JSON.stringify(lobby));
    }
    return lobby;
}

/**
 * @returns {Object|Boolean} { playerX, playerO } | false
 */
async function popFromLobby() {
    const redisClient = await getRedisClient();
    let lobby = JSON.parse(await redisClient.get(`lobby`) || '[]');
    if (lobby.length >= 2) {
        let players = lobby.slice(0,2);
        lobby = lobby.slice(2);
        await redisClient.set(`lobby`, JSON.stringify(lobby));
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
