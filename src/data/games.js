const fs = require ('fs')
const steam = require('../util/steam')

const getSharedGames = async (steamIDs) => {
    if (steamIDs.length >= 2) {
        const firstUserGames = await getGames(steamIDs[0])
        const secondUserGames = await getGames(steamIDs[1])
        let sharedGames = getCommonGames(firstUserGames, secondUserGames)

        for(i = 0; i < steamIDs.slice(2).length ; i++) {
            const currentUserGames = await getGames(steamIDs[i])
            sharedGames = getCommonGames(sharedGames, currentUserGames)
        }

        console.log(sharedGames)

    } else {
        console.log('You must input more than one steamID')
    }
}

const getGames = async (steamID) => {
    const games = await steam.getUserGames(steamID)
    return games.map(game => {
        const newGame = {...game}
        delete newGame.playTime
        delete newGame.playTime2
        return newGame
    })
}

const getCommonGames = (a, b) => {
    //Use smallest array as the array to compare against the second array
    const startingArray = (a.length > b.length) ? b : a 
    const comparisonArray = (a.length > b.length) ? a : b

    //Get appIDs in a separate array to use as a filter to the second array
    const appIDs = startingArray.map(game => game.appID)

    //Return a new array that contains games from the compared array that have an appID from the comparison array 
    return comparisonArray.filter(game => appIDs.includes(game.appID)) 
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
        '76561198053511730',
        '76561198043693649'
    ]
)