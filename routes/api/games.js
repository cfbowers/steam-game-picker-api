const router = require('express').Router()
const games = require('../../src/data/games')
const steam = require('../../src/util/steam')

router.post('/preload', (req, res) => {
    const appIDs = req.body.appIDs.split(',')
    appIDs.forEach(appID => {
        games.getGame(appID)  
    })
})

router.get('/shared', async (req, res) => {
    // const steamIDs = req.query.steamIDs.split(',')
    // const multiplayer = (req.query.multiplayer == 'true')
    // const chooseOne = (req.query.chooseOne == 'true')
    // const platforms = (req.query.platforms) ? req.query.platforms.split(',') : undefined
    const sharedGames = await games.getSharedGames([
                '76561198019642313', 
                '76561197960858972', 
                '76561198025386032', 
                '76561198051207654', 
                '76561198053511730',
                '76561198043693649'
            ])
    res.send(sharedGames)
})

router.get('/:appID', async (req, res) => {
    res.send(await games.getGame(req.params.appID))
})


module.exports = router