const router = require('express').Router()
var createError = require('http-errors')

const SteamAPI = require('steamapi');
//https://steamcommunity.com/dev/apikey
const steam = new SteamAPI('D33F1E31EBC53CA8B78168933A324732');

router.get('/', function(req, res, next) {
    res.send({
        message: 'Welcome!'
    })
})

router.get('/friend-search', function(req, res, next) {
    userName = req.query.userName

    steam.resolve(`https://steamcommunity.com/id/${userName}`
    ).then(userId => {
        res.send({
            id: userId
        })
    }).catch(() => {
        res.send({
            error: `Unable to find ID for user ${userName}`
        })
    })
})

module.exports = router
