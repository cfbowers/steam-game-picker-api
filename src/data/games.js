const fs = require ('fs')
const steam = require('../util/steam')
const Cache = require('../data/cache')
const users = require('../data/users')

const gamesCache = new Cache('games')

const getGame = async (appID) => {
    const cachedGame = gamesCache.get(appID)
    if (cachedGame) {
        console.log('game already in cache')
        gamesCache.refreshTTL(appID)
        return cachedGame
        
    } else {
        const steamGameData = await steam.getGameDetails(appID)
        gamesCache.save(appID, steamGameData)
        console.log('saved game data from steam to cache')
        return steamGameData
    }
}

const getCommonGames = (a, b) => {
    const smallerSet = (a.length > b.length) ? b : a 
    const largerSet = (a.length > b.length) ? a : b
    const appIDs = largerSet.map(game => game.appID)
    return smallerSet.filter(game => appIDs.includes(game.appID)) 
}

const getSharedGames = async (steamIDs) => {
    if (steamIDs.length >= 2) {
        const firstUser = await users.getUser(steamIDs[0])
        const secondUser = await users.getUser(steamIDs[1])
        let sharedGames = getCommonGames(firstUser.games, secondUser.games)

        for(i = 0; i < steamIDs.slice(2).length ; i++) {
            const currentUser = await users.getUser(steamIDs[i])
            sharedGames = getCommonGames(sharedGames, currentUser.games)
        }

        return Promise.all(sharedGames.map(appID => getGame(appID)))

    } else {
        console.log('You must input more than one steamID')
    }
}

module.exports = {
    getSharedGames: getSharedGames,
    getGame: getGame 
}

// getSharedGames(
//     [
//         '76561198019642313', 
//         '76561197960858972', 
//         '76561198025386032', 
//         '76561198051207654', 
//         '76561198053511730',
//         '76561198043693649'
//     ]
// )

// http://localhost:3001/api/games/shared?steamIDs=76561198019642313,76561197960858972,76561198025386032,76561198051207654,76561198053511730,76561198043693649
// http://localhost:3001/api/games/shared?steamIDs=76561198019642313,76561197960858972,76561198025386032,76561198053511730,76561198043693649
// BAD http://localhost:3001/api/games/shared?steamIDs=76561198019642313,76561197960858972,76561198025386032,76561198053511730

// Current progress: Functions are linked up to the games api endpoint. I need to figure out how to make the request faster.
// It looks like you could possibly make the request for multiple appIDs at once: https://wiki.teamfortress.com/wiki/User:RJackson/StorefrontAPI#Parameters_3
// Also, sometimes the app details don't get returned (SteamAPI.js:160), and when that happens a reject promise fucks everything up