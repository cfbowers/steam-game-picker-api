const router = require('express').Router()
const AppUser = require('../data/models/appUser')

router.post('/', async (req, res) => {
    try {
        const authUser = await AppUser.findByCredentials(req.body.email, req.body.password)
        res.send(authUser)
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router