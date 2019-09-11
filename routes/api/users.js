const router = require('express').Router()
const users = require('../../src/data/users')

router.get('/:steamID', async (req, res) => {
    res.send(await users.getUser(req.params.steamID)['games'])
})

router.post('/preload', (req, res) => {
    const steamIDs = req.body.steamIDs.split(',')
    steamIDs.forEach(steamID => {
        users.getUser(steamID)
    })
})

// router.get('/:steamID/all-data', async (req, res) => {
//     res.send(await steam.getUserSteamDataAll(req.params.steamID))
// })

// router.get('/:steamID/games', async (req, res) => {
//     res.send(await steam.getUserGames(req.params.steamID))
// })

// router.get('/:steamID/friends', async (req, res) => {
//     res.send(await steam.getUserFriends(req.params.steamID))
// })

module.exports = router
