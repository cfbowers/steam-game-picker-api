const { defaultHandler } = require('./higherOrder'); 
const { badRequest } = require('../../util/errors');

const getProfile = (req) => {
  const { steamUtil, user: { steamid } } = req; 
  if (!steamUtil) return Promise.reject(badRequest('no steam account associated with profile'));
  const profileOptions = { includeAppIds: true, includeFriendIds: true };
  return steamUtil.getOrNewSteamUser(steamid, profileOptions);
};

const getFriends = (req) => {
  const { user: { steamid }, steamUtil } = req; 
  const friendsOptions = { includeAppIds: true, includeFriendIds: false }; 
  return steamUtil.getFriendsDetails(steamid, friendsOptions);
}; 

const getSharedGames = (req) => {
  const { query: { steamIds }, steamUtil } = req; 
  const steamIdArray = steamIds.split(',');
  if (steamIdArray.length <= 1) return Promise.reject(badRequest('more than 1 steamId required'));
  return steamUtil.getSharedGames(steamIdArray);
}; 

const updateProfile = async (req) => {
  const { user: { steamid }, steamUtil, query } = req; 
  const includeFriends = query.includeFriends === 'true'; 
  const profileUpdateOptions = { update: true, includeAppIds: true, includeFriendIds: true }; 
  await steamUtil.getOrNewSteamUser(steamid, profileUpdateOptions);

  if (includeFriends) {
    const friendUpdateOptions = { update: true, includeAppIds: true }; 
    await steamUtil.getFriendsDetails(steamid, friendUpdateOptions);
  }

  return 'completed update of profile' + ((includeFriends) ? ' and profiles of friends': ''); 
}; 

module.exports = { 
  getProfile: defaultHandler(getProfile), 
  getFriends: defaultHandler(getFriends), 
  getSharedGames: defaultHandler(getSharedGames), 
  updateProfile: defaultHandler(updateProfile) 
}; 