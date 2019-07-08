const mongoHelper = require('./mongo')
const log = require('../utils/winston')

const gamesCollection = mongoHelper.collectionsEnum.allGames


const gameExists = async (appID) => {
    const game = await mongoHelper.getDocument(gamesCollection, { appID })
    return (game) ? true : false 
}

/*
    Need to enforce appID to be unique with mongoose, otherwise there could be multiple records in the db
    Leaving this version of the function commented out for now. I'll make userIsGameOwner internal-only 
    for now. Function overloading is an argument for moving to TypeScript. I dunno if I'll need this 
    externally though, so leaving it out for now. 
*/
// const userIsGameOwner = async (steamID, appID) => {
//     const game = await mongoHelper.getDocument(gamesCollection, { appID })
//     return game.owners.includes(steamID)
// }

const userIsGameOwner = async (steamID, gameObject) => {
    return gameObject.owners.includes(steamID)
}

const makeUserGameOwner = async (steamID, appID) => {
    const game = await mongoHelper.getDocument(gamesCollection, { appID })
    if (userIsGameOwner(steamID, game)) {
        return { message: `${steamID} is already an owner of ${appID}, skipping` }
    } else {
        const updatedOwners = game.owners
        updatedOwners.push(steamID)
        await mongoHelper.updateDocument(gamesCollection, { _id: game._id }, {
            $set: { owners: updatedOwners }
        })
        return { message: `${steamID} added as an owner of ${appID}` }
    }
}

const insertNewGame = async (gameObject) => {
    const exists = await gameExists(gameObject.appID)
    if (exists) {
        return { message: 'Game alread exists in the db' }
    } else {
        gameObject['owners'] = []
        return await mongoHelper.insertDocument(gamesCollection, gameObject)
    }
}


module.exports = {
    makeUserGameOwner: makeUserGameOwner,
    insertNewGame: insertNewGame
}
