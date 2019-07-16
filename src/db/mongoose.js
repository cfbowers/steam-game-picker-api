const mongoose = require('mongoose')
const config = require('config')

const mongoUrl = `${config.get('mongo.url')}/${config.get('mongo.database')}`
const mongoConnectionOptions = config.get('mongo.connection-options')


mongoose.connect(mongoUrl, mongoConnectionOptions)

const User = new mongoose.model('User', {
    steamID:  { type: String, required: true, unique: true, dropDups: true },
    nickname: { type: String },
    realName: { type: String, default: '' },
    avatar:   { type: Object }
})

const Game = new mongoose.model('Game', {
    appID:       { type: Number, required: true, unique: true, dropDups: true},
    name:        { type: String, required: true},
    platforms:   { type: Object },
    multiplayer: { type: Boolean },
    logoURL:     { type: String },
    iconURL:     { type: String },
    owners:      { type: Array, required: true, default: [] }
})



module.exports = {
    User,
    Game
}