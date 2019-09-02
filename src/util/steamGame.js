const steam = require('./steam')
const mongoose = require('../db/mongoose')
const sUser = require('../util/steamUser')


const importGamesBySteamID = async (steamID) => {
    const userGames = await steam.getUserGames(steamID)
    // Privacy settings can cause no games to be returned
    // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0001.29
    if (userGames === undefined) {
        console.log(`Unable to add game data for user ${steamID}, account is probably private`)
    } else {
        userGames.forEach(game => importGame(game, steamID))                   
    }
}

const getSharedGames = async (steamIDs, multiplayer = false, platforms, chooseOne = false) => {
    // const searchQuery = { owners: { $all: steamIDs }, multiplayer }
    const searchQuery = { owners: { $all: steamIDs } }
    if (platforms)
        platforms.forEach(platform => { searchQuery[`platforms.${platform}`] = true })
    const results = await mongoose.Game.find(searchQuery)
    if (chooseOne) {
        let randomIndex = Math.floor(Math.random() * results.length)
        return results[randomIndex]
    } else {
        return results
    }
}

const updateSharedGames = async () => {
    const steamIDs = await sUser.getAllSteamIDs()
    const sharedGames = await mongoose.Game.find({ owners: { $all: steamIDs } })
    sharedGames.forEach(game => appendGameDetails(game))
}

const appendGameDetails = async (game) => {
    const details = await steam.getGameDetails(game.appID)
    if (details) {
        game['multiplayer'] = details.multiplayer || false,
        game['platforms'] = details.platforms
        await game.save()
        console.log(`updated ${game.name} with additional details`)
    }
}

const importGame = async (game, steamID) => {
    const existingGame = await mongoose.Game.findOne({ appID: game.appID })
    if (existingGame) {
        addGameOwner(game.appID, steamID)
    } else {
        delete game.playTime
        delete game.playTime2
        game['owners'] = [steamID]
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

module.exports = {
    importGamesBySteamID: importGamesBySteamID,
    getSharedGames: getSharedGames,
    updateSharedGames: updateSharedGames
}