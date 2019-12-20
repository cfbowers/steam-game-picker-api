const router = require('express').Router()
const games = require('../../src/data/games')


router.get('/shared-appIDs', async (req, res) => {
    const steamIDs = req.query.steamIDs.split(',')
    const sharedAppIDs = await games.getSharedGames(steamIDs)
    res.send(sharedAppIDs)
})

router.get('/shared', async (req, res) => {
    const steamIDs = req.query.steamIDs.split(',')
    const platforms = (req.query.platforms) ? req.query.platforms.split(',') : []
    const sharedGames = await games.getSharedGames(steamIDs)
    const filteredGames = games.filterGames(sharedGames, { platforms })
    res.send(filteredGames)
})

router.get('/:appID', async (req, res) => {
    res.send(await games.getGame(req.params.appID))
})


module.exports = router