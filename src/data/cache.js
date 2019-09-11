const NodeCache = require('node-cache')
const config = require('config')

class Cache {

    constructor(description, stdTTL = 600) {
        this.cache = new NodeCache( { stdTTL } )
        this.description = description

        this.cache.on('expired', (key, value) => {
            console.log(`${key} is being removed from the ${description} cache`)
        })
    }
    
    save = (key, obj) => {
        this.cache.set(key, obj, (error, success) => {
            console.log( (!error && success ) ? `saved ${key} to the ${this.description} cache` : error ) 
        })
    }
    
    get = (key) => {
        return this.cache.get(key)
    }

    refreshTTL = (key) => {
        this.cache.ttl(key, this.stdTTL)
        console.log(`updated ttl for ${key} to ${this.stdTTL}`)
    } 
        
} 
    
module.exports = Cache