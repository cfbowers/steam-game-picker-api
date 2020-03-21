const mongoose = require('mongoose');

const steamGameSchema = mongoose.Schema({
  steam_appid: {
    type: Number, 
    required: true, 
    index: true
  },
  name: String, 
  is_free: Boolean,
  website: String,
  platforms: Object,
  categories: Array,
  genres: Array,
  header_image: String, 
  background: String,
  short_description: String,
  error: String
});


const SteamGame = mongoose.model('SteamGame', steamGameSchema);

module.exports = SteamGame;