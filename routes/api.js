const router = require('express').Router()
const steamHelper = require('../helpers/steam')
const mongoHelper = require('../helpers/mongo')
const conf = require('config')

const userDataCollection = conf.get('mongo.collections.user-data')

router.get('/', (req, res) => {

})

router.patch('/users', (req, res) => {
    steamID = req.body.steamID

    steamHelper.getUserSteamData(steamID).then(userData => {
        findQuery = { steamID: steamID }
        updateOperations = { 
            games: userData.games,
            nickname: userData.nickname,
            realName: userData.realName,
            avatar: userData.avatar
        }
        mongoHelper.updateRecord(userDataCollection, findQuery, updateOperations)
        .then(result =>[
            res.send(result)
        ])
    })
})

router.get('/users', (req, res) => {
    mongoHelper.getAll(userDataCollection)
    .then(results => {
        res.send(results)
    })
})

router.post('/users', (req, res) => {
    const steamID = req.query.steamID
    steamHelper.getUserSteamData(steamID)
    .then(userData => { 
        mongoHelper.saveDocument(userDataCollection, userData)
        .then(result => {
            res.send({ message: `user data was saved successfully for ${steamID}`})
        })
    })
})

router.get('/friend-search', (req, res, next) => {
    // userName = req.query.userName
    // steam.resolve(`https://steamcommunity.com/id/${encodeURI(userName)}`)
})

module.exports = router
