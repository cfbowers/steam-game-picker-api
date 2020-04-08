const mongoose = require('mongoose');

const steamUserSchema = mongoose.Schema({
  steamid: { type: String, required: true, index: { unique : true, dropDups : true } }, 
  personaname: String,
  realname: String,
  avatar: String, 
  avatarmedium: String, 
  avatarfull: String, 
  communityvisibilitystate: Number,
  profilestate: Number, 
  profileurl: String,
  friends: Array,
  appIds: Array
});


const SteamUser = mongoose.model('SteamUser', steamUserSchema);

module.exports = SteamUser;