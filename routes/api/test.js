const router = require('express').Router()
const steam = require('../../src/util/steam')
// const sGame = require('../../src/util/steamGame')


router.get('/steam/:id', async (req, res) => {
    const arg = req.params.id
    const returnValue = await steam.test(arg)   
    res.send(returnValue)
})



module.exports = router