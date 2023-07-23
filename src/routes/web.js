const express = require('express');
const { getUserVisitCount } = require('../services/UserService');
const { findGame } = require('../services/GameService');

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
        res.render('gameplay', {
            username: req.user.username,
            myMark: game.playerX == req.user.username ? 'X'
                : (game.playerO == req.user.username ? 'O' : ''),
        });
    }
});

module.exports = router
