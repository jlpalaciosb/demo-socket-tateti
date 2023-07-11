const express = require('express');
const { getUserVisitCount } = require('../services/UserService');

const router = express.Router()

router.get('/', async (req, res) => {
    const vcount = await getUserVisitCount(req.user.username);
    res.render('index', {
        username: req.user.username,
        vcount,
    })
})

module.exports = router
