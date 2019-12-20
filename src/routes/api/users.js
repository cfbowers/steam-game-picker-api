const router = require('express').Router()
const users = require('../../util/users')


router.get('/:steamID', async (req, res) => {
    try {
        const user = await users.getUser(req.params.steamID)
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/:steamID/appIDs', async (req, res) => {
    try {
        const user = await users.getUser(req.params.steamID)
        res.send(user.appIDs)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/:steamID/friendIDs', async (req, res) => {
    try {
        const user = await users.getUser(req.params.steamID)
        res.send(user.friends)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/:steamID/friends', async (req, res) => {
    try {
        const user = await users.getUser(req.params.steamID)
        const detailedFriends = await Promise.all(
            user.friends.map(friend => users.getUser(friend))
        )
        res.send(detailedFriends)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
