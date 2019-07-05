const { MongoClient } = require('mongodb')
const config = require('config')

const saveGamesDocumentToMongo = (document) => {
    MongoClient.connect(config.get('mongo.url'), { useNewUrlParser: true }).then(client => {
        const db = client.db('steam-games')
        const games = db.collection('games')
        
        games.insertOne(document).then(result => {
            console.log(result)
        }).catch(error => {
            console.log(error)
        })
    })
}