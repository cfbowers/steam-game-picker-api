const mongoose = require('mongoose')

const steamGameSchema = mongoose.Schema({
  steam_appid: {
    type: String, 
    required: true, 
    alias: 'appId',
    index: {
      unique: true, 
      dropDups: true
    }
  },
  name: String, 
  is_free: Boolean,
  platforms: Object,
  header_image: String, 
  background: String,
  short_description: String,
  error: String
})


const SteamGame = mongoose.model('SteamGame', steamGameSchema)

module.exports = SteamGame