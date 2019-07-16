const router = require('express').Router()
const mongoose = require('../../src/db/mongoose')
const sGame = require('../../src/util/steamGame')


router.get('/', async (req, res) => {
    res.send(await mongoose.Game.find({})) 
})

router.get('/shared', async (req, res) => {
    
})

router.post('/', async (req, res) => {
    res.send(await sGame.importGamesBySteamID(req.body.steamID.trim()))
})

module.exports = router