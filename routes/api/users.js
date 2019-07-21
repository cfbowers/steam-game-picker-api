const router = require('express').Router()
const mongoose = require('../../src/db/mongoose')
const sUser = require('../../src/util/steamUser')


router.get('/', async (req, res) => {
    res.send(await  mongoose.User.find({})) 
})

router.get('/:id/friends', async (req, res) => {
    res.send(await sUser.getUserFriends(req.params.id))
})

router.post('/', async (req, res) => {
    res.send(await sUser.importUser(req.body.steamID.trim())) 
})

module.exports = router
