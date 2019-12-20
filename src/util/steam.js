const SteamAPI = require('steamapi')
const config = require('config')

const steam = new SteamAPI(config.get('steam.key'))

const getUserSteamDataAll = async (steamID) => {
    const user = await getUserSteamData(steamID)
    const friends = await getUserFriends(steamID)
    const games = await getUserGames(steamID)
    
    if (user.error){
        return user
    } else {
        user['visibilityDescription'] = (user.visibilityState == 3) ? 'public' : 'non-public'
        user['friends'] = (friends.error) ? undefined : friends 
        user['appIDs'] = (games.error) ? undefined : games 
        return user
    } 
}

const getUserSteamData = async (steamID) => {
    try {
        return await steam.getUserSummary(steamID)
    } catch {
        return { error: `unable to get user data for ${steamID}` }  
    }
}

const getUserFriends = async (steamID) => {
    try {
        const friends = await steam.getUserFriends(steamID)
        const steamIDs = friends.map(friend => friend.steamID)
        return steamIDs
    } catch {
        return { error: `unable to get friends for ${steamID}, account may be private` }
    }
}

const getUserGames  = async (steamID) => {
    try {
        const games = await steam.getUserOwnedGames(steamID)
        return games.map(game => game.appID)
    } catch (e) {
        return { error: `unable to get games for ${steamID}, account may be private: ${e}` }
    }
}

const getGameDetails = async (appID) => {
    try {
        return await steam.getGameDetails(appID)
    } catch (e) {
        console.log(`unable to get game details for ${appID}: ${e}`)
        return undefined
    }
}

module.exports = {
    getUserSteamData: getUserSteamData,
    getUserSteamDataAll: getUserSteamDataAll,
    getUserGames: getUserGames,
    getUserFriends: getUserFriends,
    getGameDetails: getGameDetails,
}
