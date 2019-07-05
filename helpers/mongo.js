const { MongoClient } = require('mongodb')
const config = require('config')

const mongoURL = `${config.get('mongo.url')}/${config.get('mongo.database')}`
const connectionOptions = { useNewUrlParser: true }

const getAll = (collection) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, connectionOptions).then(client => {
            client.db().collection(collection).find().toArray().then(results => {
                resolve(results)
            })
        })
    })
}

const saveDocument = (collection, document) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoURL, connectionOptions).then(client => {
            const col = client.db().collection(collection)

            col.insertOne(document).then(result => {
                resolve(result)
            }).catch(error => {
                reject(error) 
            })
        })
    })
}

const updateRecord = (collection, findRecordQueryObject, updateRecordOperationsObject) => {
    return new Promise ((resolve, reject) => {
        MongoClient.connect(mongoURL, connectionOptions)
        .then(client => {
            const col = client.db().collection(collection)
            col.findOneAndUpdate(findRecordQueryObject, { $set: updateRecordOperationsObject })
            .then(result => {
                resolve(result)
            })
        })
    })
}

module.exports = {
    saveDocument: saveDocument,
    getAll: getAll,
    updateRecord: updateRecord
}