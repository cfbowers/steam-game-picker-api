const SteamAPI = require('steamapi')
const config = require('config')
// Nando: 76561198025386032
// Me: 76561198019642313

const steam = new SteamAPI(config.get('steam.key'))

const getUserSteamData = async (steamID) => {
    try {
        const userSummary = await steam.getUserSummary(steamID)
        return {
            steamID, 
            nickname: userSummary.nickname,
            realName: userSummary.realName,
            avatar: userSummary.avatar
        }
    } catch (e) {
        return undefined
    }
}

const getUserGames = async (steamID) => {
    try {
        const games = await steam.getUserOwnedGames(steamID)
        return  games 
    } catch {
        return undefined
    }
}

const isMultiplayer = (categories) => {
    let isMulti = false 
    if (categories) {
        categories.forEach(category => {
            if (category.id == 36) 
                isMulti = true
        })
    }
    return isMulti
}

/*
    For some reason, some games do not allow you to get the details 
    This does not appear to be related to login. Look at 
    https://steamdb.info/app/307780/
    compared to 
    https://steamdb.info/app/320/
*/ 
const getGameDetails = async (appID) => {
    try {
        const gameDetails = await steam.getGameDetails(appID)
        const multiplayer = isMultiplayer(gameDetails.categories)
        return { platforms: gameDetails.platforms, multiplayer }
    } catch (e) {
        return e
    }
}

module.exports = {
    getUserSteamData: getUserSteamData,
    getUserGames: getUserGames,
    getGameDetails: getGameDetails
}
