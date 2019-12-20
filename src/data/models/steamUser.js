const mongoose = require('mongoose')

const SteamUser = mongoose.model('SteamUser', {
    realName: String, 
    nickname: String, 
    steamID: { 
        type: String, 
        index: true, 
        required: true,
        minlength: 17,
        maxlength: 17  
    },
    avatar: Object, 
    friends: Array, 
    appIDs: Array, 
})

module.exports = SteamUser