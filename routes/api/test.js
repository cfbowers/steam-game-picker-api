const router = require('express').Router()
const mongoose = require('../../src/db/mongoose')
const steam = require('../../src/util/steam')


router.get('/steam/:id', async (req, res) => {
    const arg = req.params.id
    const returnValue = await steam.test(arg)   
    res.send(returnValue)
})


module.exports = router