const router = require('express').Router()
const mongoose = require('../../src/db/mongoose')
const steam = require('../../src/util/steam')
const sGame = require('../../src/util/steamGame')


router.get('/steam/:id', async (req, res) => {
    const arg = req.params.id
    const returnValue = await steam.test(arg)   
    res.send(returnValue)
})

router.get('/update-games', async (req, res) => {
    sGame.updateSharedGames()
})


module.exports = router