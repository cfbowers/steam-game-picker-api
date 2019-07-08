const router = require('express').Router()
const steamHelper = require('../helpers/steam')
const mongoHelper = require('../helpers/mongo')
const grunt = require('../helpers/data-grunt')
const conf = require('config')

const userDataCollection = mongoHelper.collections.userData
const gamesCollection = mongoHelper.collections.allGames

router.get('/games', (req, res) => {
    mongoHelper.getDocuments(gamesCollection, {})
    .then(results => {
        res.send(results)
    })
})

//Updates the games count
router.post('/games', (res, req) => {
	mongoHelper.dropCollection(gamesCollection)
		.then(results => {
			console.log({ message: `Dropped collection: ${gamesCollection}` })
		})
		.catch(result => {
			console.log({ error: 'Unable to drop collection, it may already not exist' })
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

router.get('/users', (req, res) => {
	mongoHelper.getDocuments(userDataCollection, {})
		.then(results => {
			res.send(results)
		})
})

router.post('/users', (req, res) => {
    const steamID = req.body.steamID
    const userData = await steamHelper.getUserSteamData(steamID)
    console.log('I did something?')
    res.send( { message: 'Yep'} )
	// steamHelper.getUserSteamData(steamID)
	// 	.then(userData => { 
	// 		mongoHelper.insertDocument(userDataCollection, userData)
	// 			.then(result => {
    //                 mongoHelper.insertDocument(gamesCollection, userData.games)
    //                 .then(result => {
    //                     res.send({ message: `user data was saved successfully for ${steamID}`})
    //                 })
	// 			})
	// 	})
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


router.get('/friend-search', (req, res, next) => {
	// userName = req.query.userName
	// steam.resolve(`https://steamcommunity.com/id/${encodeURI(userName)}`)
})

module.exports = router
