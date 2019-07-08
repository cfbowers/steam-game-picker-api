const { MongoClient } = require('mongodb')
const config = require('config')

const mongoURL = `${config.get('mongo.url')}/${config.get('mongo.database')}`
const connectionOptions = config.get('mongo.connection-options')

const collectionsEnum = {
    allGames: config.get('mongo.collections.all-owned-games'),
    userData: config.get('mongo.collections.user-data')
}

const connect = async () => {
	return await MongoClient.connect(mongoURL, connectionOptions)
}

const getDocument = async (collection, searchQueryObject) => {
    const client = await connect()
    return await client.db().collection(collection).findOne(searchQueryObject)
}

const getDocuments = async (collection, searchQueryObject) => {
    const client = await connect()
    return await client.db().collection(collection).find(searchQueryObject).toArray()
}

const insertDocument = async (collection, document) => {
    const client = await connect()
    return await client.db().collection(collection).insertOne(document)
}

const updateDocument = async (collection, findRecordQueryObject, updateRecordOperationsObject) => {
	const client = await connect()
    return await client.db().collection(collection)
        .findOneAndUpdate(findRecordQueryObject, updateRecordOperationsObject)
}

const dropCollection = async (collection) => {
	const client = await connect()
	return await client.db().collection(collection).drop()
}

module.exports = {
    insertDocument: insertDocument,
    getDocument: getDocument,
	getDocuments: getDocuments,
	updateDocument: updateDocument,
    dropCollection: dropCollection,
    collectionsEnum: collectionsEnum
}
