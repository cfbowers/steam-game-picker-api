const steam = require('./steam')
const Cache = require('../data/cache')
const users = require('./users')

const gamesCache = new Cache('games', 1800)

const getGame = async (appID) => {
    const cachedGame = gamesCache.get(appID)
    if (cachedGame) {
        console.log(`${appID} found in games cache`)
        gamesCache.refreshTTL(appID)
        return cachedGame
        
    } else {
        const steamGameData = await steam.getGameDetails(appID)
        gamesCache.save(appID, steamGameData)
        return steamGameData
    }
}

const getCommonGames = (a, b) => {
    const smallerSet = (a.length > b.length) ? b : a 
    const largerSet = (a.length > b.length) ? a : b
    const commonGames = smallerSet.filter(appID => {
        return largerSet.includes(appID)
    }) 
    return commonGames
}

const getSharedGames = async (steamIDs) => {
    if (steamIDs.length >= 2) {
        const firstUser = await users.getUser(steamIDs[0])
        const secondUser = await users.getUser(steamIDs[1])
        const remainingUsers = steamIDs.slice(2)
        let sharedAppIDs = getCommonGames(firstUser.appIDs, secondUser.appIDs)

        for(i = 0; i < remainingUsers.length ; i++) {
            const currentUser = await users.getUser(remainingUsers[i])
            sharedAppIDs = getCommonGames(sharedAppIDs, currentUser.appIDs)
        }

        return Promise.all(sharedAppIDs.map(appID => getGame(appID)))

    } else {
        log.warn('You must input more than one steamID')
    }
}

const filterGames = (games, filters) => {
    //Category filter, looking for online-multiplayer
    //Need to clean up the if (game) {} business below 
    let filteredGames = games.filter(game => {
        if (game) {
            const categoryIDs = game.categories.map(category => category.id)
            return categoryIDs.includes(36)
        } else {
            return game
        }
    })

    //Platform filter
    return filteredGames.filter(game => {
        let includesAllPlatforms = true
        let platformIndex = 1 

        while (platformIndex < filters.platforms.length) {
            filters.platforms.forEach(platform => {
                if (game.platforms[platform] === false) 
                    includesAllPlatforms = false
            })
            platformIndex++ 
        }
        
        return includesAllPlatforms
    })
}

module.exports = {
    getSharedGames: getSharedGames,
    getGame: getGame,
    filterGames: filterGames 
}