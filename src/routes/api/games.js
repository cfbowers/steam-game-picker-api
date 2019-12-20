const router = require('express').Router()
const games = require('../../util/games')


router.get('/shared-appIDs', async (req, res) => {
    try {
        const steamIDs = req.query.steamIDs.split(',')
        const sharedAppIDs = await games.getSharedGames(steamIDs)
        res.send(sharedAppIDs)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/shared', async (req, res) => {
    try {
        const steamIDs = req.query.steamIDs.split(',')
        const platforms = (req.query.platforms) ? req.query.platforms.split(',') : []
        const sharedGames = await games.getSharedGames(steamIDs)
        const filteredGames = games.filterGames(sharedGames, { platforms })
        res.send(filteredGames)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/:appID', async (req, res) => {
    try {
        res.send(await games.getGame(req.params.appID))
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router