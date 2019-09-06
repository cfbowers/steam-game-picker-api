const router = require('express').Router()
const games = require('../../src/data/games')

router.get('/shared', async (req, res) => {
    const steamIDs = req.query.steamIDs.split(',')
    // const multiplayer = (req.query.multiplayer == 'true')
    // const chooseOne = (req.query.chooseOne == 'true')
    // const platforms = (req.query.platforms) ? req.query.platforms.split(',') : undefined
    const sharedGames = await games.getSharedGames(steamIDs)
    res.send(sharedGames)
})

module.exports = router