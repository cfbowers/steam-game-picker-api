const mongoose = require('mongoose');

const steamUserSchema = mongoose.Schema({
  steamID: { type: String, alias: 'steamid', required: true, index: {
    unique : true,
    dropDups : true
  } }, 
  nickname: String,
  realName: String,
  personaname: String, 
  avatar: Object, 
  visibilityState: Number,
  url: String,
  friends: { type: Array, default: [] },
  appIds: Array
});


const SteamUser = mongoose.model('SteamUser', steamUserSchema);

module.exports = SteamUser;