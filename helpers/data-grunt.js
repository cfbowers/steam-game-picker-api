const mongoHelper = require('./mongo')

const gamesCollection = mongoHelper.collections.allGames


const gameExists = async (appID) => {
    const game = await mongoHelper.getDocument(gamesCollection, { appID })
    return (game) ? true : false 
}

const userIsGameOwner = async (steamID, appID) => {
    const game = await mongoHelper.getDocument(gamesCollection, { appID })
    console.log(game)
    return game.owners.includes(steamID)
}

const makeUserGameOwner = async (steamID, appID) => {
    const game = await mongoHelper.getDocument(gamesCollection, { appID })
    const updatedOwners = game.owners
    updatedOwners.push(steamID)
    await mongoHelper.updateDocument(gamesCollection, { _id: game._id }, {
        $set: { owners: updatedOwners }
    })
    return { message: `${steamID} added as an owner of ${appID}` }
}

const insertNewGameDocument = async (gameObject) => {
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
    userIsGameOwner: userIsGameOwner,
    insertNewGameDocument: insertNewGameDocument
}
