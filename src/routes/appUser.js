const router = require('express').Router()
const AppUser = require('../data/models/appUser')


router.get('/', async (req, res) => {
    try {
        res.send(await AppUser.find({}))
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const appUser = new AppUser(req.body)
        await appUser.save()
        res.send(appUser)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const appUser = await AppUser.findById(req.params.id)
        if (!appUser)
            return res.status(404).send({ error: `Unable to find user by id ${req.params.id}`})

        const updatedParams = Object.keys(req.body)
        updatedParams.forEach(param => appUser[param] = req.body[param])
        await appUser.save()

        res.send(appUser)
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const appUser = await AppUser.findByIdAndDelete(req.params.id)
        if (!appUser)
            return res.status(404).send({ error: `Unable to find user by id ${req.params.id}`})

        res.send({ message: "successfully deleted appUser", appUser })
    } catch (e) {
        res.status(500).send({ error: e.message })
    }
})


module.exports = router