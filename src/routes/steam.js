const router = require('express').Router()
const auth = require('../middleware/auth')


router.use(auth)

router.get('/profile', async (req, res) => {
    try {
        res.send(req.steam)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/friends', async (req, res) => {
    try {
        //show user's friends -- full list 
    } catch (e) {
        res.status(500).send(e)
    }
})


router.get('/shared-apps', async (req, res) => {
    try {
        //With no query params it should should show shared apps with individual friends 
        //e.g. { friend: 'steamID', sharedApps: [1,2,3] }
        //With steamIDs query param it should show just the shared appIDs between the logged in user and the steamIDs provided 
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router
