const SteamAPI = require('steamapi')
const SteamUser = require('../data/models/steamUser')


class SteamUtil {
  constructor(key) {
    this.steamApi = new SteamAPI(key)
  }

  saveSteamUserAppIds = async (dbSteamUser) => {
    const games = await this.steamApi.getUserOwnedGames(dbSteamUser.steamID) 
    dbSteamUser.appIds = games.map(game =>  game.appID)
    await dbSteamUser.save()
    console.log(`saved appIds for ${this.idAndName(dbSteamUser)}`)
  }

  getSteamUserFriendIds = async (steamid) => {
    const friends = await this.steamApi.getUserFriends(steamid)
    return friends.map(friend => friend.steamID) 
  }

  saveSteamUserFriendIds = async (dbSteamUser) => {
    dbSteamUser.friends = await this.getSteamUserFriendIds(dbSteamUser.steamID)
    await dbSteamUser.save()
    console.log(`saved friendIds for ${this.idAndName(dbSteamUser)}`) 
  }

  getOrNewSteamUser = async (steamid) => {
    let dbSteamUser = await SteamUser.findOne( { steamID: steamid } )

    if (!dbSteamUser) { 
      const userData = await this.steamApi.getUserSummary(steamid)
      dbSteamUser = await new SteamUser(userData)
    }
    return dbSteamUser
  }

  idAndName = (dbSteamUser) => {
    const name = dbSteamUser.nickname || dbSteamUser.realName || undefined
    return name ? `${dbSteamUser.steamID}: ${name}` : dbSteamUser.steamID
  }

  saveOrUpdateSteamUser = async (steamid, options) => {
    try {
      if(!steamid)
        throw new Error('you must provide a steamid')
  
      let dbSteamUser = await this.getOrNewSteamUser(steamid)
      
      if (!dbSteamUser.isNew) { 
        const userSummary = await this.steamApi.getUserSummary(steamid)
        const updateKeys = Object.keys(userSummary)
        updateKeys.forEach(key => dbSteamUser[key] = userSummary[key])
      }
      
      const action = dbSteamUser.isNew ? 'saved' : 'updated'
      await dbSteamUser.save()
      console.log(`${action} ${this.idAndName(dbSteamUser)}`)

      if (options.includeAppIds) 
        await this.saveSteamUserAppIds(dbSteamUser)

      if (options.includeFriendIds) 
        await this.saveSteamUserFriendIds(dbSteamUser)

      if (options.includeFriendDetails) {
        const friendIds = await this.getSteamUserFriendIds(steamid)
        friendIds.forEach(
          steamID => this.saveOrUpdateSteamUser(
            steamID, 
            options.includeFriendDetails
        ))
      }
      
      return dbSteamUser

    } catch (e) {
      console.log(e)

    }
  }
}


module.exports = SteamUtil
