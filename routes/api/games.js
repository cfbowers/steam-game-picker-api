const router = require('express').Router()
const mongoose = require('../../src/db/mongoose')
const sGame = require('../../src/util/steamGame')
const sUser = require('../../src/util/steamUser')


router.get('/', async (req, res) => {
    res.send(await mongoose.Game.find({})) 
})

router.get('/shared', async (req, res) => {
    const steamIDs = await sUser.getAllSteamIDs()
    const multiplayer = (req.query.multiplayer == 'true')
    const platforms = (req.query.platforms) ? req.query.platforms.split(',') : undefined
    const sharedGames = await sGame.getSharedGames(steamIDs, multiplayer, platforms)
    res.send(sharedGames)
})

router.post('/', async (req, res) => {
    res.send(await sGame.importGamesBySteamID(req.body.steamID.trim()))
    const steamIDs = await sUser.getAllSteamIDs()
    await sGame.updateSharedGames(steamIDs)
})

module.exports = router