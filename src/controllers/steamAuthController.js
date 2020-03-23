const feUrl = require('config').get('app.feUrl');


exports.get = (_req, res) => res.redirect(feUrl + '/profile');

exports.return = async (req, res) => { 
  const steamid = req.user._json.steamid;
  const options =  { includeAppIds: true, includeFriendIds: true, update: true };
  await req.steamUtil.getOrNewSteamUser(steamid, options);
  res.redirect(feUrl + '/profile');
};