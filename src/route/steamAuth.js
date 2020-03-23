const router = require('express').Router();
const pp = require('../middleware/passport');
const feUrl = require('config').get('app.feUrl');


router.use(pp.setup);
router.use(pp.steamAuth);

router.get('/', (req, res) => res.redirect(feUrl + '/profile'));

router.get('/return', async (req, res) => { 
  const steamid = req.user._json.steamid;
  const options =  { includeAppIds: true, includeFriendIds: true, update: true };
  await req.steamUtil.getOrNewSteamUser(steamid, options);
  res.redirect(feUrl + '/profile');
});


module.exports = router;