const router = require('express').Router()
const AppUser = require('../data/models/appUser')

router.post('/', async (req, res) => {
    try {
        const user = await AppUser.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

module.exports = router