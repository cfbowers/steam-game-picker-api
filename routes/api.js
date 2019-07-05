const router = require('express').Router()
const steamHelper = require('../helpers/steam')
const mongoHelper = require('../helpers/mongo')

router.get('/', (req, res) => {

})

router.get('/get-games', (req, res) => {
    req.query.steamIDs.split(',').forEach(steamID => {
        steamHelper.getUserSteamData(steamID).then(document => { 
            console.log(document)
        })
    })
})

router.get('/friend-search', (req, res, next) => {
    // userName = req.query.userName
    // steam.resolve(`https://steamcommunity.com/id/${encodeURI(userName)}`)
})

module.exports = router
