const fs = require ('fs')
const steam = require('../util/steam')
const Cache = require('../data/cache')

const userCache = new Cache('users')

const getUser = async (steamID) => { 
    const cachedUser = userCache.get(steamID)
    if (cachedUser) {
        console.log('user already in cache')
        userCache.refreshTTL(steamID)
        return cachedUser
        
    } else {
        const steamUserData = await steam.getUserSteamDataAll(steamID)
        console.log('got user data from steam, saving to cache')
        userCache.save(steamID, steamUserData)
        return steamUserData
    }
}


module.exports = {
    getUser: getUser
}