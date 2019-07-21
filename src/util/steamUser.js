const mongoose = require('../../src/db/mongoose')
const steam = require('./steam')

const getAllSteamIDs = async () => { 
    const allUsers = await mongoose.User.find({})
    return allUsers.map(user => { return user.steamID } )
}

const getUserFriends = async (steamID) => {
    return await steam.getUserFriends(steamID)
}

const importUser = async (steamID) => {
    try {
        const userData = await steam.getUserSteamData(steamID)
        await new mongoose.User(userData).save()
        return { success: `Saved user ${steamID}`} 
    } catch (error) { 
        //if user already exists, the app should update the user (future)
        if (error.message.includes('duplicate key'))
            return { info: `user ${steamID} already exists`}
    }
}

module.exports = { 
    importUser: importUser,
    getAllSteamIDs: getAllSteamIDs,
    getUserFriends: getUserFriends
}