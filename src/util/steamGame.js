const steam = require('./steam')
const mongoose = require('../db/mongoose')


const importGamesBySteamID = async (steamID) => {
    const userGames = await steam.getUserGames(steamID)
    userGames.forEach(game => importGame(game, steamID))
}

const importGame = async (game, steamID) => {
    const existingGame = await mongoose.Game.findOne({ appID: game.appID })
    if (existingGame) {
        addGameOwner(game.appID, steamID)
    } else {
        game = cleanGameObject(game)
        game['owners'] = [steamID]

        const gameDetails = await steam.getGameDetails(game.appID)
        if (gameDetails) {
            console.log(gameDetails)
            game['multiplayer'] = gameDetails.multiplayer,
            game['platforms'] = gameDetails.platforms
        }
        await new mongoose.Game(game).save()
        console.log(`imported ${game.name}`)
    }
}

const addGameOwner = async (appID, steamID) => {
    const game = await mongoose.Game.findOne({ appID })
    if (game && ( game.owners == undefined || !game.owners.includes(steamID) ) ) { 
        const newOwners = game.owners || [] 
        newOwners.push(steamID)
        game.owners = newOwners
        await game.save() 
        console.log(`added ${steamID} as an owner of ${game.name}`)
    }
}

const cleanGameObject = (game) =>{
    delete game.playTime
    delete game.playTime2
    return game
}

module.exports = {
    importGamesBySteamID: importGamesBySteamID
}