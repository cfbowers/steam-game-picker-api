const steamServices = require('../../services/steamServices'); 
const steamApi = require('../../util/steamApi');
const { defaultHandler } = require('./higherOrder'); 
const { badRequest } = require('../../util/errors');


const getProfile = (req) => steamServices.getSteamUser(req.user.steamApiKey, req.user.steamid); 
const getFriends = (req) => steamApi.getFriendsDetails(req.user.steamApiKey, req.user.steamid, false, false);

const getSharedGames = (req) => {
  const steamIdArray = req.query.steamIds.split(',');
  if (steamIdArray.length <= 1) return Promise.reject(badRequest('more than 1 steamId required'));
  return steamServices.getSharedGames(req.user.steamApiKey, steamIdArray);
}; 


module.exports = { 
  getProfile: defaultHandler(getProfile), 
  getFriends: defaultHandler(getFriends), 
  getSharedGames: defaultHandler(getSharedGames)
}; 