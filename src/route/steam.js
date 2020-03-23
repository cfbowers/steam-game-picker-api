const router = require('express').Router();
const auth = require('../middleware/auth');
const updateSteamProfile = require('../route-service/steam').updateSteamProfile;
const success = require('../util/helpers/jSendData').success;


router.use(auth);

router.get('/profile', async ({ steamUtil, user: { steamid } }, res) => {
  const profileOptions = { includeAppIds: true, includeFriendIds: true };
  const user = await steamUtil.getOrNewSteamUser(steamid, profileOptions);
  res.send(success(user));
});

router.post('/profile/update', async ({ user, steamUtil, query }, res, next) => {
  await updateSteamProfile(user, steamUtil, (query.includeFriends === 'true'))
    .then((msg) => res.send(success(msg)))
    .catch((err) => next(err));
});

router.get('/friends', async ({ user: { steamid }, steamUtil }, res) => {
  const friendsOptions = { includeAppIds: true, includeFriendIds: false }; 
  const friends = await steamUtil.getFriendsDetails(steamid, friendsOptions);
  res.send(success({ friends }));
});

router.get('/shared-games', async ({ query: { steamIds }, steamUtil }, res, next) => {
  const steamIdArray = steamIds.split(',');
  if (steamIdArray.length <= 1) 
    return next({ status: 400, message: 'more than 1 steamId is required' });
  const sharedGames = await steamUtil.getSharedGames(steamIdArray);
  res.send(success({ sharedGames }));
});


module.exports = router;
