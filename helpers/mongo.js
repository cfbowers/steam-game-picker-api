const { MongoClient } = require('mongodb')
const config = require('config')

const mongoURL = `${config.get('mongo.url')}/${config.get('mongo.database')}`
const connectionOptions = config.get('mongo.connection-options')

const collectionsEnum = {
    allGames: config.get('mongo.collections.all-owned-games'),
    userData: config.get('mongo.collections.user-data')
}

let _db;

const connect = async () => {
    const db =  await MongoClient.connect(mongoURL, connectionOptions)
    _db = db
}

module.exports = {
    connect, 
    db: () => { return _db },
    collectionsEnum
}