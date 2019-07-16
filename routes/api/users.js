const router = require('express').Router()
const mongoose = require('../../src/db/mongoose')
const sUser = require('../../src/util/steamUser')


router.get('/', async (req, res) => {
    res.send(await  mongoose.User.find({})) 
})

router.post('/', async (req, res) => {
    res.send(await sUser.importUser(req.body.steamID.trim())) 
})

module.exports = router
