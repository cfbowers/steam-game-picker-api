const mongoose = require('../../src/db/mongoose')
const steam = require('./steam')

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
    importUser: importUser
}