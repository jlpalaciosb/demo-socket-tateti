const { findUserBySession, newUsername, insertUser, insertSession } = require("../services/UserService");
const crypto = require('crypto');

/**
 * Middleware para establecer usuario a la peticion via cookie
 */
async function mwSetUser(req, res, next) {
    const {sessionid} = req.cookies;
    let user = await findUserBySession(sessionid);
    if (user) {
        req.user = user;
    } else {
        user = { username: newUsername() };
        const sessionid = crypto.randomBytes(16).toString('hex');
        insertUser(user);
        insertSession({
            username: user.username,
            sessionid: sessionid,
        });
        req.user = user;
        res.cookie('sessionid', sessionid);
    }
    next();
}

module.exports = {
    mwSetUser
}