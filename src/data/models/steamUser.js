const mongoose = require('mongoose')

const steamUserSchema = mongoose.Schema({
  steamid: { 
    type: String, 
    index: true, 
    required: true,
    minlength: 17,
    maxlength: 17
  },
  realname: String, 
  personaname: String, 
  avatar: String, 
  avatarmedium: String, 
  avatarfull: String, 
  communityvisibilitystate: Number,
  profilestate: Number,
  friends: Array,
  appIds: Array
})


const SteamUser = mongoose.model('SteamUser', steamUserSchema)

module.exports = SteamUser