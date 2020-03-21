const router = require('express').Router();
const auth = require('../middleware/auth');


router.use(auth);

router.get('/profile', async (req, res) => {
  try {
    const user = await req.steamUtil.getOrNewSteamUser(
      req.user.steamid, { includeAppIds: true, includeFriendIds: true });
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/profile/update', async (req, res) => {
  try {
    let success = 'completed update of profile';
    const includeFriendsInUpdate = (req.query.includeFriends === 'true');
    await req.steamUtil.getOrNewSteamUser(
      req.user.steamid, { update: true, includeAppIds: true, includeFriendIds: true });

    if (includeFriendsInUpdate) {
      await req.steamUtil.getFriendsDetails(
        req.user.steamid, { update: true, includeAppIds: true });
      success += ' and profiles of friends';
    }

    res.status(200).send({ success });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/friends', async (req, res) => {
  try {
    const details = await req.steamUtil.getFriendsDetails(
      req.user.steamid, { includeAppIds: true, includeFriendIds: false });
    res.status(200).send(details);
  } catch (e) {
    res.status(500).send(e);
  }
});


router.get('/shared-games', async (req, res) => {
  try {
    let steamIds = req.query.steamIds;
    let platforms = req.query.platforms ? req.query.platforms.split(',') : undefined;

    if (!steamIds) {
      return res.status(400).send(
        { error: 'you must provide the \'steamIds\' query param' }); 
    }

    steamIds = steamIds.split(',');

    if(!(steamIds.length > 1)) {
      return res.status(400).send(
        { error: 'you must provide more than one steamId' }); 
    }

    const sharedGames = await req.steamUtil.getSharedGames(steamIds, platforms);
    res.status(200).send(sharedGames);
    
  } catch (e) { 
    res.status(500).send(e); 
  }
});


module.exports = router;
