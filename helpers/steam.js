const SteamAPI = require('steamapi')
const config = require('config')
// Nando: 76561198025386032
// Me: 76561198019642313

const steam = new SteamAPI(config.get('steam.key'))

const getUserSteamData = async (steamID) => {
    const userSummary = await steam.getUserSummary(steamID)
    return {
        steamID, 
        nickname: userSummary.nickname,
        realName: userSummary.realName,
        avatar: userSummary.avatar
    }
}

const getUserGames = async (steamID) => {
    const games = await steam.getUserOwnedGames(steamID)
    return { games }
}


module.exports = {
    getUserSteamData: getUserSteamData,
    getUserGames: getUserGames
}