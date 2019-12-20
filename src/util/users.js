const steam = require('./steam')
const Cache = require('../data/cache')

const userCache = new Cache('users', 1200)

const getUser = async (steamID) => { 
    const cachedUser = userCache.get(steamID)
    if (cachedUser) {
        console.log(`${steamID} found in user cache`)
        userCache.refreshTTL(steamID)
        return cachedUser
        
    } else {
        const steamUserData = await steam.getUserSteamDataAll(steamID)
        console.log(`retrieved user details for ${steamID}, saved in users cache`)
        userCache.save(steamID, steamUserData)
        return steamUserData
    }
}

module.exports = {
    getUser: getUser
}