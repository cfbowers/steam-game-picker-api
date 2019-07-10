const router = require('express').Router()
const steamHelper = require('../helpers/steam')
const mongoHelper = require('../helpers/mongo')
const grunt = require('../helpers/data-grunt')
const conf = require('config')

const userDataCollection = mongoHelper.collectionsEnum.userData
const gamesCollection = mongoHelper.collectionsEnum.allGames

router.get('/users', (req, res) => {
    mongoHelper.getDocuments(userDataCollection, {})
        .then(results => {
            res.send(results)
        })
})

router.post('/users', (req, res) => {
    const steamID = req.body.steamID
    grunt.importUser(steamID).then(result => {
        res.send(result)
    })
})

router.get('/games', (req, res) => {
    mongoHelper.getDocuments(gamesCollection, {})
    .then(results => {
        res.send(results)
    })
})

router.get('/games/shared/one-random', (req, res) => {

})

router.get('/games/shared', (req, res) => {
    grunt.getAllUsers().then(users => {
        const searchQueryObject = { owners: { $all: users } }


        if (req.query.multiPlayer)
            searchQueryObject['multiPlayer'] = (req.query.multiPlayer == 'true') //try toBoolean 

        if (req.query.platform) {
            switch (req.query.platform) {
                case 'linux':
                    searchQueryObject["platforms.linux"] = true 
                    break
                case 'mac':
                    searchQueryObject["platforms.mac"] = true
                    break 
                default:
                    searchQueryObject["platforms.windows"] = true 
            }
        }
        mongoHelper.getDocuments(gamesCollection, searchQueryObject)
        .then(results => {
            res.send(results)
        })
    })
})

module.exports = router
