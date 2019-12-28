//Router for getting and modifying the logged in user's profile
const router = require('express').Router()
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.patch('/', auth, async (req, res) => {
    try {
        const updatedParams = Object.keys(req.body)
        updatedParams.forEach(param => req.user[param] = req.body[param])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.delete('/', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send({ success: 'successfully deleted profile', deletedUser: req.user})
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

module.exports = router