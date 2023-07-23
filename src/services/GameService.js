const db = require('../mongodb');
const {getRedisClient} = require('../redisdb');

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

// /**
//  * Encontrar usuario por clave de usuario
//  * @param {String} sessionid clave del usuario
//  * @returns {Object} instancia del usuario ó null
//  */
// async function findUserBySession(sessionid) {
//     const sessions = db.collection('sessions');
//     const query = { sessionid };
//     const session = await sessions.findOne(query);
//     if (session) {
//         const user = await findUser(session.username);
//         return user;
//     } else {
//         return null;
//     }
// }

// /**
//  * @param {Object} nuevo usuario
//  * @returns {Boolean} true en caso de exito
//  */
// async function insertUser(user) {
//     const users = db.collection('users');
//     const insertResult = await users.insertOne(user);
//     return true;
// }

// /**
//  * @param {Object} session nuevo
//  * @returns {Boolean} true en caso de exito
//  */
// async function insertSession(session) {
//     const sessions = db.collection('sessions');
//     const insertResult = await sessions.insertOne(session);
//     return true;
// }

// /**
//  * test redis db
//  * @param {String} username
//  * @returns {Number} cantidad de visitas
//  */
// async function getUserVisitCount(username) {
//     const redisClient = await getRedisClient();
//     const c = await redisClient.get(`vc:${username}`) || 1;
//     await redisClient.set(`vc:${username}`, Number(c) + 1);
//     return c;
// }

module.exports = {
    findGame,
}