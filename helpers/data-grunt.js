const mongoHelper = require('./mongo')
const steamHelper = require('../helpers/steam')
const log = require('../utils/winston')

const userCollection = mongoHelper.collectionsEnum.userData
const gameCollection = mongoHelper.collectionsEnum.allGames

const trimUserObject = (userData) => {
    return {
        steamID: userData.steamID,
        nickname: userData.nickname,
        realName: userData.realName,
        avatar: userData.avatar
    }
}

const appendDetailsToGameObject = async (gameObject) => {
    const gameDetails = await steamHelper.getGameDetails(gameObject.appID)
    if (gameDetails) { 
        gameObject['platforms'] = gameDetails.platforms
        gameObject ['multiPlayer'] = gameDetails.multiPlayer
    }
    gameObject['owners'] = []
    gameObject['_id'] = gameObject.appID
    return gameObject
}

const getAllUsers = async () => {
    const users = await mongoHelper.getDocuments(userCollection, {})
    const usersArray = []
    users.forEach(user => {
        usersArray.push(user.steamID)
    })
    return usersArray
}

const userExists = async (steamID) => {
    const user = await mongoHelper.getDocument(userCollection, { steamID })
    return (user) ? true : false 
}

const gameExists = async (appID) => {
    const game = await mongoHelper.getDocument(gameCollection, { appID })
    return (game) ? true : false 
}

/*
    Need to enforce appID to be unique with mongoose, otherwise there could be multiple records in the db
    Leaving this version of the function commented out for now. I'll make userIsGameOwner internal-only 
    for now. Function overloading is an argument for moving to TypeScript. I dunno if I'll need this 
    externally though, so leaving it out for now. 
*/
// const userIsGameOwner = async (steamID, appID) => {
//     const game = await mongoHelper.getDocument(gameCollection, { appID })
//     return game.owners.includes(steamID)
// }

const userIsGameOwner = async (steamID, gameObject) => {
    return gameObject.owners.includes(steamID)
}

const makeUserGameOwner = async (steamID, appID) => {
    const game = await mongoHelper.getDocument(gameCollection, { appID })
    const userOwnsGame = await userIsGameOwner(steamID, game) 
    if (userOwnsGame) {
        log.info(`${steamID} is already an owner of ${appID}, skipping`)
    } else {
        const updatedOwners = game.owners
        updatedOwners.push(steamID)
        await mongoHelper.updateDocument(gameCollection, { _id: game._id }, {
            $set: { owners: updatedOwners }
        })
        log.info(`${steamID} added as an owner of ${appID}`)
    }
}

const insertNewGame = async (gameObject) => {
    const exists = await gameExists(gameObject.appID)
    if (exists) {
        log.info(`${gameObject.name} (${gameObject.appID}) alread exists in the db, skipping`)
    } else {
        const newGameObject = await appendDetailsToGameObject(gameObject)
        log.info(`Adding ${gameObject.name} (${gameObject.appID}) to ${gameCollection}`)
        return await mongoHelper.insertDocument(gameCollection, newGameObject)
    }
}

const importUser = async (steamID) => {
    const userAlreadyExists = await userExists(steamID)
    if (userAlreadyExists) {
        const info = `${steamID} already exists, skipping`
        log.info(info)
        return { info }
    } else {
        const userData = await steamHelper.getUserSteamData(steamID)
        if (userData) {
            const userRecord = await trimUserObject(userData)
            const userSaveResult = await mongoHelper.insertDocument(userCollection, userRecord)
            log.info(`Added user ${userData.nickname} to ${userCollection} with an id of ${userSaveResult.insertedId}`)
            
            const userGames = await steamHelper.getUserGames(steamID)
            if (userGames){
                userGames.forEach(game => {
                    insertNewGame(game).then(() => {
                        makeUserGameOwner(steamID, game.appID).then(() => {
                            return { success: `Imported ${steamID} (${userData.nickname}), and their games`}
                        })
                    })
                })
            } else {
                return { error: `Unable to get games for ${steamID}`}
            }
        } else {
            return { error: `Unable to get user data for ${steamID}` }
        }
    }
}

module.exports = {
    getAllUsers: getAllUsers,
    makeUserGameOwner: makeUserGameOwner,
    insertNewGame: insertNewGame,
    importUser: importUser
}