const router = require('express').Router()
const games = require('../../src/data/games')

router.post('/preload', (req, res) => {
    const appIDs = req.body.appIDs.split(',')
    appIDs.forEach(appID => {
        games.getGame(appID)  
    })
})

router.get('/shared-appIDs', async (req, res) => {
    const steamIDs = req.query.steamIDs.split(',')
    const sharedAppIDs = await games.getSharedGames(steamIDs)
    res.send(sharedAppIDs)
})

router.get('/shared', async (req, res) => {
    const steamIDs = req.query.steamIDs.split(',')
    const multiplayer = (req.query.multiplayer == 'true')
    const chooseOne = (req.query.chooseOne == 'true')
    const platforms = (req.query.platforms) ? req.query.platforms.split(',') : undefined
    const sharedGames = await games.getSharedGames(steamIDs)
    const filteredGames = games.filterGames(sharedGames, { multiplayer, chooseOne, platforms })
    res.send(filteredGames)
})

router.get('/:appID', async (req, res) => {
    res.send(await games.getGame(req.params.appID))
})


module.exports = router