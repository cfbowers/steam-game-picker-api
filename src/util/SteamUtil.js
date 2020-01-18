const SteamAPI = require('steamapi')
const SteamUser = require('../data/models/steamUser')
const SteamGame = require('../data/models/steamGame')


class SteamUtil {
  constructor(key) {
    this.steamApi = new SteamAPI(key)
  }

  idAndName = (dbUserOrGame) => {
    let name = ''
    let id = ''

    if (dbUserOrGame.steamID) {
      name = dbUserOrGame.nickname || dbUserOrGame.realName || undefined
      id = dbUserOrGame.steamID
    }
    
    if (dbUserOrGame.steam_appid) {
      name = dbUserOrGame.name || dbUserOrGame.short_description || undefined
      id = dbUserOrGame.steam_appid
    }

    return `${id}: ${name}`
  }

  getFriendIds = async (steamid) => {
    const friends = await this.steamApi.getUserFriends(steamid)
    return friends.map(friend => friend.steamID) 
  }

  getFriendsDetails = async (steamid, options) => {
    const friendIds = await this.getFriendIds(steamid)
    const friendsDetails = []
    for(let i = 0; i < friendIds.length; i++ ) {
      const user = await this.getOrNewSteamUser(friendIds[i], options)
      friendsDetails.push(user)
    }
    return friendsDetails
  }

  saveFriendIds = async (dbSteamUser) => {
    dbSteamUser.friends = await this.getFriendIds(dbSteamUser.steamID)
    await dbSteamUser.save()
    console.log(`got and saved friendIds for ${this.idAndName(dbSteamUser)}`) 
  }

  saveAppIds = async (dbSteamUser) => {
    const games = await this.steamApi.getUserOwnedGames(dbSteamUser.steamID) 
    dbSteamUser.appIds = games.map(game =>  game.appID)
    await dbSteamUser.save()
    console.log(`got and saved appIds for ${this.idAndName(dbSteamUser)}`)
  }

  getOrNewSteamUser = async (steamid, options = {}) => {
    try {
      if(!steamid)
        throw new Error('you must provide a steamid')
  
      let dbSteamUser = await SteamUser.findOne( { steamID: steamid } )
  
      if (!dbSteamUser) { 
        const userData = await this.steamApi.getUserSummary(steamid)
        dbSteamUser = await new SteamUser(userData)
        await dbSteamUser.save()
        console.log(`saved new user ${this.idAndName(dbSteamUser)}`)
      }

      if (options.update) { 
        const userSummary = await this.steamApi.getUserSummary(steamid)
        const updateKeys = Object.keys(userSummary)
        updateKeys.forEach(key => dbSteamUser[key] = userSummary[key])
        await dbSteamUser.save()
        console.log(`updated ${this.idAndName(dbSteamUser)}`)
      }
      
      if (options.includeAppIds && (dbSteamUser.appIds.length == 0 || options.update )) 
        await this.saveAppIds(dbSteamUser)

      if (options.includeFriendIds && (dbSteamUser.friends.length == 0 || options.update )) 
        await this.saveFriendIds(dbSteamUser)
      
      return dbSteamUser

    } catch (e) {
      console.log(e)

    }
  }

  getCommon = (a, b) => {
    const smallerSet = (a.length > b.length) ? b : a 
    const largerSet = (a.length > b.length) ? a : b
    const common = smallerSet.filter(appID => {
      return largerSet.includes(appID)
    }) 
    return common
  }
  
  getSharedGames = async (steamIDs) => {
    try {
      const firstUser = await this.getOrNewSteamUser(steamIDs[0])
      const secondUser = await this.getOrNewSteamUser(steamIDs[1])
      const remainingUsers = steamIDs.slice(2)
      let sharedAppIDs = this.getCommon(firstUser.appIds, secondUser.appIds)

      for(let i = 0; i < remainingUsers.length ; i++) {
        const currentUser = await this.getOrNewSteamUser(remainingUsers[i])
        sharedAppIDs = this.getCommon(sharedAppIDs, currentUser.appIds)
      }

      const sharedGameDetails = []
      for(let j = 0; j < sharedAppIDs.length; j++) {
        const game = await this.getOrNewSteamGame(sharedAppIDs[j])
        sharedGameDetails.push(game)
      }

      return sharedGameDetails

    } catch (e) {
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
        await dbGame.save()
        console.log(`updated ${this.idAndName(dbGame)}`)
      }
    }
    
    if (!dbGame) {
      const gameDetails = await this.getGameDetails(appId)
      dbGame = await new SteamGame(gameDetails)
      await dbGame.save()
      console.log(`saved new game ${this.idAndName(dbGame)}`)
    }
    
    return dbGame
  }
}


module.exports = SteamUtil
