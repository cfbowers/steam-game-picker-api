const { MongoClient } = require('mongodb')
const config = require('config')

const mongoURL = `${config.get('mongo.url')}/${config.get('mongo.database')}`
const connectionOptions = { useNewUrlParser: true }

const connect = () => {
    return MongoClient.connect(mongoURL, connectionOptions)
}

const getAll = (collection) => {
    return new Promise((resolve, reject) => {
        connect()
        .then(client => {
            client.db().collection(collection).find().toArray().then(results => {
                resolve(results)
            })
        })
    })
}

const saveDocument = (collection, document) => {
    return new Promise((resolve, reject) => {
        connect()
        .then(client => {
            const col = client.db().collection(collection)

            col.insertOne(document).then(result => {
                resolve(result)
            }).catch(error => {
                reject(error) 
            })
        })
    })
}

/* 
    Go through each user document 
    Go through each game 
    If the game does not exist in the game collection, add it 
    If the game does exist in the game collection, increment the count by 1
    Then, return games from the games collection that have a count equal to the number of users
*/ 

const updateRecord = (collection, findRecordQueryObject, updateRecordOperationsObject) => {
    return new Promise ((resolve, reject) => {
        connect()
        .then(client => {
            const col = client.db().collection(collection)
            col.findOneAndUpdate(findRecordQueryObject, { $set: updateRecordOperationsObject })
            .then(result => {
                resolve(result)
            })
        })
    })
}

const dropCollection = (collection) => {
    return new Promise((resolve, reject) => {
        connect()
        .then(client => {
            client.db().collection(collection).drop()
            .then(results => {
                resolve(results)
            })
        })
    })
}

module.exports = {
    saveDocument: saveDocument,
    getAll: getAll,
    updateRecord: updateRecord,
    dropCollection: dropCollection
}