const { MongoClient } = require('mongodb')
const config = require('config')

const mongoURL = `${config.get('mongo.url')}/${config.get('mongo.database')}`
const connectionOptions = config.get('mongo.connection-options')

const collections = {
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

const insertDocument = (collection, document) => {
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

const updateDocument = (collection, findRecordQueryObject, updateRecordOperationsObject) => {
	return new Promise ((resolve, reject) => {
		connect()
			.then(client => {
				const col = client.db().collection(collection)
				col.findOneAndUpdate(findRecordQueryObject, updateRecordOperationsObject)
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
					.catch((result) => {
						reject(result)
					})
			})
	})
}

module.exports = {
    insertDocument: insertDocument,
    getDocument: getDocument,
	getDocuments: getDocuments,
	updateDocument: updateDocument,
    dropCollection: dropCollection,
    collections: collections
}