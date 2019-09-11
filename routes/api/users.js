const router = require('express').Router()
const users = require('../../src/data/users')

router.post('/preload', (req, res) => {
    const steamIDs = req.body.steamIDs.split(',')
    steamIDs.forEach(steamID => {
        users.getUser(steamID)
    })
})

router.get('/:steamID', async (req, res) => {
    const user = await users.getUser(req.params.steamID)
    res.send(user)
})

router.get('/:steamID/games', async (req, res) => {
    const user = await users.getUser(req.params.steamID)
    res.send(user.games)
})

router.get('/:steamID/friends', async (req, res) => {
    const user = await users.getUser(req.params.steamID)
    res.send(user.friends)
})

module.exports = router
