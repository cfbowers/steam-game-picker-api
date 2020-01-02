const SteamAPI = require('steamapi')
const SteamUser = require('../data/models/steamUser')


const saveOrUpdateSteamUser = async (steamUserJson, key) => {
  try {
    const steam = new SteamAPI(key)
    const steamid = steamUserJson.steamid  
    let steamUser = await SteamUser.findOne( { steamid } )

    if (!steamUser) {
      steamUser = await new SteamUser(steamUserJson)
      const friends = await steam.getUserFriends(steamid)
      const games = await steam.getUserOwnedGames(steamid) 
      steamUser.friends = friends.map(friend => friend.steamID) 
      steamUser.appIds = games.map(game => game.appID)
    } else {
      const keys = Object.keys(steamUserJson)
      keys.forEach(key => steamUser[key] = steamUserJson[key])
    }

    await steamUser.save()
    console.log(`saved user with ${steamid} to the SteamUsers collection with friend and appIds`)

  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  saveOrUpdateSteamUser
}
