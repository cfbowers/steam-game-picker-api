const router = require('express').Router()
const steam = require('../../src/util/steam')
// const sGame = require('../../src/util/steamGame')


router.get('/steam/:id', async (req, res) => {
    const arg = req.params.id.split(',')
    console.log(arg)
    const returnValue = await steam.getUserSteamData(arg)   
    res.send(returnValue)
})



module.exports = router