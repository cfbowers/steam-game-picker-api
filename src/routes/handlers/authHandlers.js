const { defaultHandler, redirectHandler } = require('./higherOrder'); 
const us = require('../../services/userServices');
const feUrl = require('config').get('app.feUrl');


// since auth middleware is run before this, this will only return if the supplied token is valid.
const validate    = () => Promise.resolve('token is valid');
const login       = (req) => us.login(req.body.email, req.body.password); 
const logout      = (req) => us.logout(req.user, req.token, req.originalUrl.includes('logoutAll'));
const steamLogin  = async () => feUrl + '/profile';
const steamLoginReturn = async (req) => {
  const steamid = req.user._json.steamid;
  const options =  { includeAppIds: true, includeFriendIds: true, update: true };
  await req.steamUtil.getOrNewSteamUser(steamid, options);
  return feUrl + '/profile';
};


module.exports = { 
  validate: defaultHandler(validate), 
  login: defaultHandler(login), 
  logout: defaultHandler(logout), 
  steamLogin: redirectHandler(steamLogin), 
  steamLoginReturn: redirectHandler(steamLoginReturn) 
}; 