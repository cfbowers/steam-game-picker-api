const SteamAPI = require('steamapi');
const config = require('config')

const steam = new SteamAPI(config.get('steam.key'));

const getUserSteamData = (steamID) => {

    return new Promise((resolve, reject) => {

        steam.getUserSummary(steamID).then(userSummary => {
            steam.getUserOwnedGames(steamID).then(games => {
                const document = {
                    steamID, 
                    nickname: userSummary.nickname,
                    realName: userSummary.realName,
                    avatar: userSummary.avatar,
                    games
                }
                resolve(document)
            })          
        })
    })

}

module.exports = {
    getUserSteamData: getUserSteamData
}