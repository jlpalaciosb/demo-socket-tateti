const express = require('express');
const { getUserVisitCount, deleteSession } = require('../services/UserService');
const { findGame, getJugadas } = require('../services/GameService');

const router = express.Router()

router.get('/', async (req, res) => {
    const vcount = await getUserVisitCount(req.user.username);
    res.render('index', {
        username: req.user.username,
        vcount,
    });
});

router.get('/play/:gameId', async (req, res) => {
    const game = await findGame(req.params.gameId);
    if (!game) {
        res.send('partida no encontrada');
    } else {
        const jugadas = await getJugadas(req.params.gameId);
        res.render('gameplay', {
            username: req.user.username,
            game,
            jugadas,
        });
    }
});

router.get('/logout', async (req, res) => {
    const {sessionid} = req.cookies;
    if (sessionid) {
        deleteSession(sessionid);
    }
    res.redirect('/');
});

module.exports = router
