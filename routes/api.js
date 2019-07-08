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

// Updates user records
router.patch('/users', (req, res) => {
    steamID = req.body.steamID
    steamHelper.getUserSteamData(steamID)
        .then(userData => {
            updateOperations = { 
                $set: {
                    games: userData.games,
                    nickname: userData.nickname,
                    realName: userData.realName,
                    avatar: userData.avatar
                }
            }
            mongoHelper.updateDocument(userDataCollection, { steamID }, updateOperations)
                .then(result => {
                    res.send({ message: `Found and updated ${result.value._id} using steamID of ${findQuery.steamID}`})
                })
        })
})

router.get('/games', (req, res) => {
    mongoHelper.getDocuments(gamesCollection, {})
    .then(results => {
        res.send(results)
    })
})

router.get('/games/shared', (req, res) => {
    grunt.getAllUsers().then(users => {
        mongoHelper.getDocuments(gamesCollection, {
            owners: {
                $all: users
            }
        }).then(results => {
            res.send(results)
        })
    })
})

//Updates the games count
router.patch('/games', (res, req) => {
	mongoHelper.dropCollection(gamesCollection)
		.then(results => {
			console.log({ message: `Dropped collection: ${gamesCollection}` })
		})
		.catch(result => {
			console.log({ error: 'Unable to drop collection, it may not exist' })
		})
		.then(() => {
			mongoHelper.getDocuments(userDataCollection, {})
				.then((userData) => {
					userData.forEach(user => {
						user.games.forEach(game =>{

							let gameDocument = {
								name: game.name, 
								appID: game.appID,
								logoURL: game.logoURL,
								iconURL: game.iconURL,
								users: [
									user.steamID
								]
							}
							mongoHelper.insertDocument(userDataCollection, gameDocument)
						})
					})
				})
		})

	/* 
        Go through each user
        Go through each game 
        If the game does not exist in the db, then create
        If the game does exist then updated the count by one 
    */
})



module.exports = router
