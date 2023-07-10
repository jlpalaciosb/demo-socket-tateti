const db = require('../bd')

// List of positive adjectives
const adjectives = [
    'awesome',
    'brilliant',
    'creative',
    'dynamic',
    'energetic',
    'fantastic',
    'joyful',
    'kind',
    'lovely',
    'marvelous',
    'positive',
    'radiant',
    'strong',
    'vibrant',
    'wonderful'
];

// List of animal names
const animals = [
    'lion',
    'tiger',
    'elephant',
    'giraffe',
    'panda',
    'dolphin',
    'butterfly',
    'koala',
    'unicorn',
    'peacock',
    'parrot',
    'penguin',
    'squirrel',
    'zebra'
];

/**
 * Generar username para nuevos usuarios
 * @returns {String} new cool username
 */
function newUsername() {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    const username = `${randomAdjective}-${randomAnimal}-${randomNumber}`;  
    return username;
}

/**
 * Encontrar usuario por clave de usuario
 * @param {String} username clave del usuario
 * @returns {Object} instancia del usuario ó null
 */
async function findUser(username) {
    const users = db.collection('users');
    const query = { username };
    const user = await users.findOne(query);
    return user;
}

/**
 * Encontrar usuario por clave de usuario
 * @param {String} sessionid clave del usuario
 * @returns {Object} instancia del usuario ó null
 */
async function findUserBySession(sessionid) {
    const sessions = db.collection('sessions');
    const query = { sessionid };
    const session = await sessions.findOne(query);
    if (session) {
        const user = await findUser(session.username);
        return user;
    } else {
        return null;
    }
}

/**
 * @param {Object} nuevo usuario
 * @returns {Boolean} true en caso de exito
 */
async function insertUser(user) {
    const users = db.collection('users');
    const insertResult = await users.insertOne(user);
    return true;
}

/**
 * @param {Object} session nuevo
 * @returns {Boolean} true en caso de exito
 */
async function insertSession(session) {
    const sessions = db.collection('sessions');
    const insertResult = await sessions.insertOne(session);
    return true;
}

module.exports = {
    newUsername,
    findUser,
    findUserBySession,
    insertUser,
    insertSession,
}