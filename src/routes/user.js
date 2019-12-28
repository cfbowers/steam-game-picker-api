const router = require('express').Router()
const auth = require('../middleware/auth')
const User = require('../data/models/user')


router.get('/', auth, async (req, res) => {
    try {
        res.send(await User.find({}))
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        await user.save()
        res.send({ user, token })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user)
            return res.status(404).send({ error: `Unable to find user by id ${req.params.id}`})

        const updatedParams = Object.keys(req.body)
        updatedParams.forEach(param => user[param] = req.body[param])
        await user.save()

        res.send(user)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user)
            return res.status(404).send({ error: `Unable to find user by id ${req.params.id}`})

        res.send({ message: "successfully deleted user", user })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})


module.exports = router