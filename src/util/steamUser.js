// const mongoose = require('../../src/db/mongoose')
const steam = require('./steam')

const getAllSteamIDs = async () => { 
    const allUsers = await mongoose.User.find({})
    return allUsers.map(user => { return user.steamID } )
}

const getUserFriends = async (steamID) => {
    return await steam.getUserFriends(steamID)
}

const deleteUser = async (steamID) => {
    const deleteData = await mongoose.User.deleteOne({ steamID })
    if (deleteData.deletedCount == 1) {
        return `Deleted ${steamID}`
    } else {
        return `Unable to delete ${steamID}`
    }
}

const importUser = async (steamID) => {
    try {
        const userData = await steam.getUserSteamData(steamID)
        await new mongoose.User(userData).save()
        console.log(`Saved user data for ${steamID} to the database`)
    } catch (e) {
        //Clean this messaging up
        console.log(e.message)
    }
}

module.exports = { 
    importUser: importUser,
    getAllSteamIDs: getAllSteamIDs,
    getUserFriends: getUserFriends,
    deleteUser: deleteUser
}