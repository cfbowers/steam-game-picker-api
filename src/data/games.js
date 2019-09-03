const fs = require ('fs')
const steam = require('../util/steam')

const getSharedGames = async (steamIDs) => {
    if (steamIDs.length >= 2) {
        const firstUserGames = await steam.getUserGames(steamIDs[0])
        const secondUserGames = await steam.getUserGames(steamIDs[1])
        let sharedGames = getCommonGames(firstUserGames, secondUserGames)

        for(i = 0; i < steamIDs.slice(2).length ; i++) {
            const currentUserGames = await steam.getUserGames(steamIDs[i])
            sharedGames = getCommonGames(sharedGames, currentUserGames)
        }

    } else {
        console.log('You must input more than one steamID')
    }
}

const getCommonGames = (a, b) => {
    const smallerSet = (a.length > b.length) ? b : a 
    const largerSet = (a.length > b.length) ? a : b
    const appIDs = largerSet.map(game => game.appID)
    return smallerSet.filter(game => appIDs.includes(game.appID)) 
}

module.exports = {
    getSharedGames: getSharedGames
}

getSharedGames(
    [
        '76561198019642313', 
        '76561197960858972', 
        '76561198025386032', 
        '76561198051207654', 
        // '76561198053511730',
        '76561198043693649'
    ]
)