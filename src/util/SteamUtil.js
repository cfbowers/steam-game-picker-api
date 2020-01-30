const SteamAPI = require('steamapi')
const SteamUser = require('../data/models/steamUser')
const SteamGame = require('../data/models/steamGame')
const helpers = require('./helpers')


class SteamUtil {
  constructor(key) {
    this.steamApi = new SteamAPI(key)
  }

  getFriendIds = async (steamid) => {
    let friends = [] 
    //If there's an error getting friends then a blank array will be returned
    try { friends = await this.steamApi.getUserFriends(steamid) }
    catch (e) { console.log(e) }
    return friends.map(friend => friend.steamID) 
  }

  /**
	 * calls getOrNewSteamUser for each friend of the steamId supplied
	 * @param {string} steamId steamId of user whose friend details will be retrieved
	 * @param {Object} [options={}] options for handling updates, appIds and friends -- same as getOrNewSteamUser's options
	 */
  getFriendsDetails = async (steamid, options = {}) => {
    const friendIds = await this.getFriendIds(steamid)
    const friendsDetails = []
    for(let i = 0; i < friendIds.length; i++ ) {
      const user = await this.getOrNewSteamUser(friendIds[i], options)
      friendsDetails.push(user)
    }
    return friendsDetails
  }

  saveFriendIds = async (dbSteamUser) => {
    const friends = await this.getFriendIds(dbSteamUser.steamID)
    if (friends.length > 0) {
      dbSteamUser.friends 
      await dbSteamUser.save()
      return console.log(`got and saved friendIds for ${helpers.idAndName(dbSteamUser)}`) 
    }
    console.log(`could not get friendIds for ${helpers.idAndName(dbSteamUser)}`)
  }

  saveAppIds = async (dbSteamUser) => {
    const games = await this.steamApi.getUserOwnedGames(dbSteamUser.steamID) 
    dbSteamUser.appIds = games.map(game =>  game.appID)
    await dbSteamUser.save()
    console.log(`got and saved appIds for ${helpers.idAndName(dbSteamUser)}`)
  }

  /**
	 * Gets a SteamUser from the db, or gets profile data from the api and saves it to the db
	 * @param {string} steamId steamId of user
	 * @param {Object} [options={}] options for handling updates, appIds and friends
	 * @param {boolean} [options.includeAppIds=false] appIds will be retrieved and saved for the user if they don't exist
	 * @param {boolean} [options.includeFriendIds=false] friend steamIds will be retrieved and saved for the user if they don't exist
	 * @param {boolean} [options.update=false] 'true' will refetch user profile details from the api. if includeAppIds or
   * saveFriendIds are specified are also specified, appIds or friend steamIds will be retrieved and saved regardless
   * if they exist or not.  
	 */
  getOrNewSteamUser = async (steamid, options = {}) => {
    try {
      if(!steamid)
        throw new Error('you must provide a steamid')
  
      let dbSteamUser = await SteamUser.findOne( { steamID: steamid } )

      if (options.update && dbSteamUser) { 
        const userSummary = await this.steamApi.getUserSummary(steamid)
        const updateKeys = Object.keys(userSummary)
        updateKeys.forEach(key => dbSteamUser[key] = userSummary[key])
        await dbSteamUser.save()
        console.log(`updated SteamUser ${helpers.idAndName(dbSteamUser)}`)
      }
      
      if (!dbSteamUser) { 
        const userData = await this.steamApi.getUserSummary(steamid)
        dbSteamUser = await new SteamUser(userData)
        await dbSteamUser.save()
        console.log(`saved new SteamUser ${helpers.idAndName(dbSteamUser)}`)
      }

      //revisit this logic
      if ((options.includeAppIds && options.update ) || (options.includeAppIds && dbSteamUser.appIds.length == 0))
        await this.saveAppIds(dbSteamUser)

      if ((options.includeFriendIds && options.update ) || (options.includeFriendIds && dbSteamUser.friends.length == 0)) 
        await this.saveFriendIds(dbSteamUser)
      
      return dbSteamUser

    } catch (e) {
      console.log(e)

    }
  }
  
	/**
	 * Gets shared games for a set of steamIds
	 * @param {Array} steamIDs array of steamIds 
	 */
  getSharedGames = async (steamIDs, platforms = undefined) => {
    try {
      const firstUser = await this.getOrNewSteamUser(steamIDs[0])
      const secondUser = await this.getOrNewSteamUser(steamIDs[1])
      const remainingUsers = steamIDs.slice(2)
      let sharedAppIDs = helpers.getCommon(firstUser.appIds, secondUser.appIds)

      for(let i = 0; i < remainingUsers.length ; i++) {
        const currentUser = await this.getOrNewSteamUser(remainingUsers[i])
        sharedAppIDs = helpers.getCommon(sharedAppIDs, currentUser.appIds)
      }

      let sharedGameDetails = []
      for(let j = 0; j < sharedAppIDs.length; j++) {
        const game = await this.getOrNewSteamGame(sharedAppIDs[j])
        if(!game.error)
          sharedGameDetails.push(game)
      }


      if (platforms) {
        sharedGameDetails = sharedGameDetails.filter((sharedGame) => {
          for(let i = 0; i < platforms.length; i++) 
            if (!sharedGame.platforms || !sharedGame.platforms[platforms[i]]) 
              return false 
          return true
        })
      }

      return sharedGameDetails

    } catch (e) {
      console.log(e)
      return e
    }
  }

  getGameDetails = async (appId) => {
    try { return await this.steamApi.getGameDetails(appId) }
    catch { return {  steam_appid: appId, error: `https://store.steampowered.com/api/appdetails?appids=${appId}` } }
  }
  
  getOrNewSteamGame = async (appId) => {
    let dbGame = await SteamGame.findOne({ steam_appid: appId })

    //If there was an error saved last time, try to update
    if (dbGame && dbGame.error) {
      const gameDetails = await this.getGameDetails(appId)
      if (!gameDetails.error) {
        Object.keys(gameDetails).forEach(key => dbGame[key] = gameDetails[key])
        delete dbGame.error
        await dbGame.save()
        console.log(`updated ${helpers.idAndName(dbGame)}`)
      }
    }
    
    if (!dbGame) {
      const gameDetails = await this.getGameDetails(appId)
      dbGame = await new SteamGame(gameDetails)
      await dbGame.save()
      console.log(`saved new game ${helpers.idAndName(dbGame)}`)
    }
    
    return dbGame
  }
}


module.exports = SteamUtil
