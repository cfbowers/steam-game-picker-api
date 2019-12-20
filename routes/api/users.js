const router = require('express').Router()
const users = require('../../src/data/users')


router.get('/:steamID', async (req, res) => {
    const user = await users.getUser(req.params.steamID)
    res.send(user)
})

router.get('/:steamID/appIDs', async (req, res) => {
    const user = await users.getUser(req.params.steamID)
    res.send(user.appIDs)
})

router.get('/:steamID/friendIDs', async (req, res) => {
    const user = await users.getUser(req.params.steamID)
    res.send(user.friends)
})

router.get('/:steamID/friends', async (req, res) => {
    const user = await users.getUser(req.params.steamID)
    const detailedFriends = await Promise.all(
        user.friends.map(friend => users.getUser(friend))
    )
    res.send(detailedFriends)
})

module.exports = router
