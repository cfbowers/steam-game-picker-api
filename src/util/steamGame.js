const steam = require('./steam')
const mongoose = require('../db/mongoose')


const importGamesBySteamID = async (steamID) => {
    const userGames = await steam.getUserGames(steamID)
    const appIDs = userGames.map(game => { return game.appID })
    await mongoose.Game.insertMany(userGames, { ordered: false })
}

// const importGamesBySteamID = async (steamID) => {
//     try {
//         const userGames = await steam.getUserGames(steamID)
//         userGames.forEach(game => { 
//             mongoose.Game.findOne({ appID: game.appID })
//             .then(existingGame => {
//                 if (!existingGame) {
//                     steam.getGameDetails(game.appID)
//                     .then(details => {
//                         new mongoose.Game({ 
//                             appID: game.appID, 
//                             name: game.name, 
//                             logoURL: game.logoURL,
//                             iconURL: game.iconURL,
//                             owners: [steamID]
//                         })
//                     .save()
//                     .then(() => {
//                             console.log(`imported ${game.name}`)
//                         })
//                     })
//                 } else {
//                     addGameOwner(game.appID, steamID)
//                 }
//             })
//         }) 
        
//     } catch (error) {
//         console.log(error)
//     }
// }

const addGameOwner = async (appID, steamID) => {
    const game = await mongoose.Game.findOne({ appID })
    if (game && ( game.owners == undefined || !game.owners.includes(steamID) ) ) { 
        const newOwners = game.owners || [] 
        newOwners.push(steamID)
        game.owners = newOwners
        await game.save() 
        console.log(`added ${steamID} as an owner of ${game.name}`)
    }
}

module.exports = {
    importGamesBySteamID: importGamesBySteamID
}