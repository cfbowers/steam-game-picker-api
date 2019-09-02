const router = require('express').Router()
const mongoose = require('../../src/db/mongoose')
const sUser = require('../../src/util/steamUser')
const sGame = require('../../src/util/steamGame')

router.get('/', async (req, res) => {
    res.send(await  mongoose.User.find({})) 
})

router.get('/:id/friends', async (req, res) => {
    res.send(await sUser.getUserFriends(req.params.id))
})

router.delete('/', async (req, res) => {
    res.send(await sUser.deleteUser(req.body.steamID))
})

router.post('/', async (req, res) => {
    if (req.body.steamIDs) {
        steamIDs = req.body.steamIDs.split(',')
        for (i = 0; i < steamIDs.length; i++) {
            await sUser.importUser(steamIDs[i])
            await sGame.importGamesBySteamID(steamIDs[i])
        }
        await sGame.updateSharedGames()
        res.send('done')
    } else {
        res.send({ error: 'specify a steamID'})
    }
})

module.exports = router
