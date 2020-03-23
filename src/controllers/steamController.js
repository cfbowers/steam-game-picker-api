const success = require('../util/helpers/jSendData').success;


exports.getProfile = async ({ steamUtil, user: { steamid } }, res, next) => {
  if (!steamUtil) return next({ status: 400, message: 'no steam account associated with profile' });
  const profileOptions = { includeAppIds: true, includeFriendIds: true };
  const user = await steamUtil.getOrNewSteamUser(steamid, profileOptions);
  res.send(success(user));
};

exports.updateProfile = async ({ user, steamUtil, query }, res, next) => {
  await updateSteamProfile(user, steamUtil, (query.includeFriends === 'true'))
    .then((msg) => res.send(success(msg)))
    .catch((err) => next(err));
};

exports.getFriends = async ({ user: { steamid }, steamUtil }, res) => {
  const friendsOptions = { includeAppIds: true, includeFriendIds: false }; 
  const friends = await steamUtil.getFriendsDetails(steamid, friendsOptions);
  res.send(success({ friends }));
};

exports.getSharedGames = async ({ query: { steamIds }, steamUtil }, res, next) => {
  const steamIdArray = steamIds.split(',');
  if (steamIdArray.length <= 1) 
    return next({ status: 400, message: 'more than 1 steamId is required' });
  const sharedGames = await steamUtil.getSharedGames(steamIdArray);
  res.send(success({ sharedGames }));
};



async function updateSteamProfile ({ steamid }, steamUtil, includeFriends) {
  const profileUpdateOptions = { update: true, includeAppIds: true, includeFriendIds: true }; 
  await steamUtil.getOrNewSteamUser(steamid, profileUpdateOptions);

  if (includeFriends) {
    const friendUpdateOptions = { update: true, includeAppIds: true }; 
    await steamUtil.getFriendsDetails(steamid, friendUpdateOptions);
  }
  
  return 'completed update of profile' + ((includeFriends) ? ' and profiles of friends': ''); 
}
